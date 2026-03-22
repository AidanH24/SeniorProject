import * as XLSX from "xlsx";

// Load the workbook
const workbook = XLSX.readFile("CustomerSide/AutoData.xlsx"); // adjust path as needed

// Get the first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Write "Hello World" into cell A1
sheet["A1"] = { t: "s", v: "Hello World" };

// Tell Excel the sheet range may have changed
sheet["!ref"] = sheet["!ref"] || "A1";

// Save the workbook back to disk
XLSX.writeFile(workbook, "CustomerSide/AutoData.xlsx");

console.log("Wrote 'Hello World' to A1");