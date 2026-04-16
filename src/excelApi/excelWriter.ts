// src/excelApi/excelWriter.ts
import * as XLSX from "xlsx";
import path from "path";
import { existsSync } from "fs";

const DEFAULT_EXCEL = path.join(process.cwd(), "Data", "AutoData.xlsx");
const EXCEL_PATH = process.env.EXCEL_PATH || DEFAULT_EXCEL;

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

function enqueueWrite<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    writeQueue.push({ fn, resolve, reject });
    processQueue();
  });
}

export async function appendAppointment(rowData: Record<string, any>): Promise<void> {
  if (!rowData || Object.keys(rowData).length === 0) {
    throw new Error("Appointment payload required");
  }

  const excelPath = EXCEL_PATH;
  if (!existsSync(excelPath)) {
    throw new Error(`Excel file not found at ${excelPath}`);
  }

  function getSheetNameForAppointment(appointmentISO: string) {
    const today = new Date();
    const appt = new Date(appointmentISO);

    const monthDiff =
      (appt.getFullYear() - today.getFullYear()) * 12 +
      (appt.getMonth() - today.getMonth());

    switch (monthDiff) {
      case -1: return "LastMonth";
      case 0: return "ThisMonth";
      case 1: return "NextMonth";
      case 2: return "Month+2";
      case 3: return "Month+3";
      default:
        throw new Error(`Appointment month out of range: ${monthDiff}`);
    }
  }

  await enqueueWrite(async () => {
    console.log("📝 Writing to Excel:", rowData, "file:", excelPath);

    const workbook = XLSX.readFile(excelPath);

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

