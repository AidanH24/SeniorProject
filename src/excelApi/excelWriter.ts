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

  await enqueueWrite(async () => {
    console.log("📝 Writing to Excel:", rowData, "file:", excelPath);

    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0] || "Sheet1";
    const sheet = workbook.Sheets[sheetName];

    let rows: Record<string, any>[] = [];
    if (sheet && Object.keys(sheet).length > 0) {
      rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    } else {
      rows = [];
    }

    const columns = [
      "FirstName","LastName","Phone","Email",
      "CarMake","CarType","CarColor","CarYear",
      "ServiceType","AppointmentDate","Time","AppointmentISO"
    ];

    const newRow: Record<string, any> = {};
    for (const col of columns) {
      newRow[col] = (rowData[col] !== undefined && rowData[col] !== null) ? rowData[col] : "";
    }

    rows.push(newRow);
    const updatedSheet = XLSX.utils.json_to_sheet(rows, { header: columns });
    workbook.Sheets[sheetName] = updatedSheet;
    XLSX.writeFile(workbook, excelPath);

    console.log("✔ Appointment saved to Excel");
  });
}
