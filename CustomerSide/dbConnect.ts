// excelWriter.ts
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

const EXCEL_PATH = path.join(__dirname, "../CustomerSide/AutoData.xlsx");

export function appendAppointment(rowData: any) {
    console.log("📝 Writing to Excel:", rowData);
    // Load workbook
    const workbook = XLSX.readFile(EXCEL_PATH);

    // Use first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet → JSON
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // Append new row
    rows.push(rowData);

    // Convert JSON → sheet
    const updatedSheet = XLSX.utils.json_to_sheet(rows);

    // Replace sheet
    workbook.Sheets[sheetName] = updatedSheet;

    // Save workbook
    XLSX.writeFile(workbook, EXCEL_PATH);

    console.log("✔ Appointment saved to Excel");
}
