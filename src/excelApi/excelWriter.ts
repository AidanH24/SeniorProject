// src/excelApi/excelWriter.ts
import * as XLSX from "xlsx";
import path from "path";
import { existsSync } from "fs";


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

function needsMonthFlip(workbook: XLSX.WorkBook): boolean {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const metaSheet = workbook.Sheets["Meta"];
  if (!metaSheet) {
    console.log("Meta sheet missing → first rollover needed");
    return true;
  }

  const cell = metaSheet["A1"];
  if (!cell || cell.v == null) {
    console.log("Meta A1 empty → rollover needed");
    return true;
  }

  const storedStr = String(cell.v);
  const [storedYear, storedMonth] = storedStr.split("-").map(Number);

  const needs =
    storedYear !== currentYear ||
    storedMonth !== currentMonth;

  console.log("Meta check:", { storedStr, storedYear, storedMonth, currentYear, currentMonth, needs });

  return needs;
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

  const excelPath = EXCEL_PATH;
  if (!existsSync(excelPath)) {
    throw new Error(`Excel file not found at ${excelPath}`);
  }

  await enqueueWrite(async () => {
    console.log("📝 Writing to Excel:", rowData, "file:", excelPath);

      const workbook = XLSX.readFile(excelPath);
  if (needsMonthFlip(workbook)) {
      performMonthFlip(workbook);
      XLSX.writeFile(workbook, excelPath);
  }
    

    // ⭐ USE THE CORRECT SHEET
    const sheetName = getSheetNameForAppointment(rowData.AppointmentISO);
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in workbook`);
    }

    // Convert sheet → JSON
    let rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const columns = [
      "FirstName","LastName","Phone","Email",
      "CarMake","CarType","CarColor","CarYear",
      "ServiceType","AppointmentDate","Time","AppointmentISO"
    ];

    const newRow: Record<string, any> = {};
    for (const col of columns) {
      newRow[col] = rowData[col] ?? "";
    }

    rows.push(newRow);

    // Convert JSON → sheet
    const updatedSheet = XLSX.utils.json_to_sheet(rows, { header: columns });
    workbook.Sheets[sheetName] = updatedSheet;

    XLSX.writeFile(workbook, excelPath);

    console.log(`✔ Appointment saved to Excel sheet: ${sheetName}`);
  });
}

