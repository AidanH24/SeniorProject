//excelService is for loading workbook, read write with JSON, error check is sheet is missing

import * as XLSX from "xlsx";
import path from "path";
import fs from "fs/promises";

const EXCEL_PATH = path.join(__dirname, "../../data/AutoData.xlsx");

export async function loadWorkbook() {
  const fileBuffer = await fs.readFile(EXCEL_PATH);
  return XLSX.read(fileBuffer, { type: "buffer" });
}

export function getSheet(workbook: XLSX.WorkBook, sheetName: string) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" does not exist in the workbook.`);
  }
  return sheet;
}

export function sheetToJson(sheet: XLSX.WorkSheet) {
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

export function jsonToSheet(json: any[]) {
  return XLSX.utils.json_to_sheet(json);
}

export async function saveWorkbook(workbook: XLSX.WorkBook) {
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  await fs.writeFile(EXCEL_PATH, buffer);
}

export async function appendToSheet(sheetName: string, rowData: any) {
  const workbook = await loadWorkbook();
  const sheet = getSheet(workbook, sheetName);

  const rows = sheetToJson(sheet);
  rows.push(rowData);

  const updatedSheet = jsonToSheet(rows);
  workbook.Sheets[sheetName] = updatedSheet;

  await saveWorkbook(workbook);
}
