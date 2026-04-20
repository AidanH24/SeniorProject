// src/excelApi/excelWriter.ts
import * as XLSX from "xlsx";
import path from "path";
import { existsSync } from "fs";
import { getFileContent, updateFileContent } from "./githubClient";


const GH_OWNER = process.env.GITHUB_OWNER!;
const GH_REPO = process.env.GITHUB_REPO!;
const GH_BRANCH = process.env.GITHUB_BRANCH || "serverHostTesting";//Important change to proper branch


const DEFAULT_EXCEL = path.join(process.cwd(), "Data", "AutoData.xlsx");
export const EXCEL_PATH = process.env.EXCEL_PATH || DEFAULT_EXCEL;


type QueueItem<T> = {
  fn: () => Promise<T>;
  resolve: (v: T) => void;
  reject: (e: any) => void;
};

const writeQueue: QueueItem<any>[] = [];
let writeInProgress = false;

async function processQueue() {
  if (writeInProgress) return;
  const item = writeQueue.shift();
  if (!item) return;
  writeInProgress = true;
  try {
    const result = await item.fn();
    item.resolve(result);
  } catch (err) {
    item.reject(err);
  } finally {
    writeInProgress = false;
    setImmediate(processQueue);
  }
}

async function downloadExcelFromGitHub() {
  const { buffer, sha } = await getFileContent(
    GH_OWNER,
    GH_REPO,
    EXCEL_PATH,
    GH_BRANCH
  );

  const workbook = XLSX.read(buffer, { type: "buffer" });
  return { workbook, sha };
}

async function uploadExcelToGitHub(workbook: XLSX.WorkBook, sha: string) {
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  await updateFileContent(
    GH_OWNER,
    GH_REPO,
    EXCEL_PATH,
    buffer,
    "Update Excel file",
    sha,
    GH_BRANCH
  );
}

function ensureMeta(workbook: XLSX.WorkBook) {
  if (!workbook.Sheets["Meta"]) {
    const today = new Date();
    workbook.Sheets["Meta"] = XLSX.utils.aoa_to_sheet([
      [`${today.getFullYear()}-${today.getMonth()}`]
    ]);
  }
}


function needsMonthFlip(workbook: XLSX.WorkBook): boolean {
  const metaSheet = workbook.Sheets["Meta"];
  if (!metaSheet) return false; // ❗ never rollover on missing Meta

  const cell = metaSheet["A1"];
  if (!cell || cell.v == null) return false; // ❗ never rollover on empty Meta

  const storedStr = String(cell.v);
  const [storedYear, storedMonth] = storedStr.split("-").map(Number);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return storedYear !== currentYear || storedMonth !== currentMonth;
}



function performMonthFlip(workbook: XLSX.WorkBook) {
  console.log("🔄 Performing monthly Excel rollover...");

  const ensure = (name: string) => {
    if (!workbook.Sheets[name]) {
      workbook.Sheets[name] = XLSX.utils.json_to_sheet([]);
    }
    return workbook.Sheets[name];
  };

  const last = ensure("LastMonth");
  const thisM = ensure("ThisMonth");
  const next = ensure("NextMonth");
  const plus2 = ensure("Month+2");
  const plus3 = ensure("Month+3");

  workbook.Sheets["LastMonth"] = thisM;
  workbook.Sheets["ThisMonth"] = next;
  workbook.Sheets["NextMonth"] = plus2;
  workbook.Sheets["Month+2"] = plus3;
  workbook.Sheets["Month+3"] = XLSX.utils.json_to_sheet([]);

  const today = new Date();
  workbook.Sheets["Meta"] = XLSX.utils.aoa_to_sheet([
    [`${today.getFullYear()}-${today.getMonth()}`]
  ]);

  console.log("✔ Monthly rollover complete");
}



function enqueueWrite<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    writeQueue.push({ fn, resolve, reject });
    processQueue();
  });
}
function toLocalDateOnly(dateISO: string): Date {
  const d = new Date(dateISO);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getSheetNameForAppointment(appointmentISO: string): string {
  const appt = toLocalDateOnly(appointmentISO);

  // Use the appointment's month window, NOT today's date
  const base = new Date(); 
  const today = new Date(base.getFullYear(), base.getMonth(), 1);

  const monthDiff =
    (appt.getFullYear() - today.getFullYear()) * 12 +
    (appt.getMonth() - today.getMonth());

  if (monthDiff <= -1) return "LastMonth";
  if (monthDiff === 0) return "ThisMonth";
  if (monthDiff === 1) return "NextMonth";
  if (monthDiff === 2) return "Month+2";
  if (monthDiff === 3) return "Month+3";

  console.warn("Out-of-range appointment:", { appointmentISO, monthDiff });
  return "ThisMonth";
}



export async function appendAppointment(rowData: Record<string, any>): Promise<void> {
  if (!rowData || Object.keys(rowData).length === 0) {
    throw new Error("Appointment payload required");
  }

  await enqueueWrite(async () => {
    console.log("📝 Writing to Excel via GitHub:", rowData);

    // 1. Pull latest Excel from GitHub
    const { workbook, sha } = await downloadExcelFromGitHub();

    // 1.5 Ensure Meta exists (but do NOT rollover)
    ensureMeta(workbook);

    // 2. Rollover (now safe because file persists)
    if (needsMonthFlip(workbook)) {
      performMonthFlip(workbook);
    }

    // 3. Determine correct sheet
    const sheetName = getSheetNameForAppointment(rowData.AppointmentISO);
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);

    // 4. Convert sheet → JSON
    let rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // 5. Add new row
    rows.push(rowData);

    // 6. Convert JSON → sheet
    workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(rows);

    // 7. Upload updated Excel back to GitHub
    await uploadExcelToGitHub(workbook, sha);

    console.log(`✔ Appointment saved to GitHub sheet: ${sheetName}`);
  });
}



