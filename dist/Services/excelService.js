"use strict";
//excelService is for loading workbook, read write with JSON, error check is sheet is missing
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendToSheet = exports.saveWorkbook = exports.jsonToSheet = exports.sheetToJson = exports.getSheet = exports.loadWorkbook = void 0;
const XLSX = __importStar(require("xlsx"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const EXCEL_PATH = path_1.default.join(__dirname, "../../data/AutoData.xlsx");
async function loadWorkbook() {
    const fileBuffer = await promises_1.default.readFile(EXCEL_PATH);
    return XLSX.read(fileBuffer, { type: "buffer" });
}
exports.loadWorkbook = loadWorkbook;
function getSheet(workbook, sheetName) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
        throw new Error(`Sheet "${sheetName}" does not exist in the workbook.`);
    }
    return sheet;
}
exports.getSheet = getSheet;
function sheetToJson(sheet) {
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}
exports.sheetToJson = sheetToJson;
function jsonToSheet(json) {
    return XLSX.utils.json_to_sheet(json);
}
exports.jsonToSheet = jsonToSheet;
async function saveWorkbook(workbook) {
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    await promises_1.default.writeFile(EXCEL_PATH, buffer);
}
exports.saveWorkbook = saveWorkbook;
async function appendToSheet(sheetName, rowData) {
    const workbook = await loadWorkbook();
    const sheet = getSheet(workbook, sheetName);
    const rows = sheetToJson(sheet);
    rows.push(rowData);
    const updatedSheet = jsonToSheet(rows);
    workbook.Sheets[sheetName] = updatedSheet;
    await saveWorkbook(workbook);
}
exports.appendToSheet = appendToSheet;
