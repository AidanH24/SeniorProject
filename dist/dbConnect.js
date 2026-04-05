"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendAppointment = appendAppointment;
// excelWriter.ts
const XLSX = __importStar(require("xlsx"));
const path_1 = __importDefault(require("path"));
const EXCEL_PATH = path_1.default.join(__dirname, "../CustomerSide/AutoData.xlsx");
function appendAppointment(rowData) {
    console.log("Writing to Excel:", rowData);
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
    console.log("Appointment saved to Excel");
}
