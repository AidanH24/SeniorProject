// src/routes/submitRoute.ts
import express from "express";
import { AppointmentPayload, ExcelRow } from "../types";
import { loadWorkbook, getSheet, sheetToJson, appendToSheet } from "../Services/excelService";
import { getSheetForDate } from "../Services/sheetSelector";
import { isBlackout } from "../Services/blackoutService";

const router = express.Router();

function formatAppointmentDateForExcel(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function nextIdFromRows(rows: any[]): number {
  if (!rows || rows.length === 0) return 1;
  const ids = rows
    .map(r => {
      const v = r.ID ?? r.Id ?? r.id;
      return typeof v === "number" ? v : Number(v);
    })
    .filter(n => !isNaN(n));
  if (ids.length === 0) return 1;
  return Math.max(...ids) + 1;
}

router.post("/", async (req, res) => {
  try {
    const payload = req.body as AppointmentPayload;

    // Basic validation
    const required = ["firstName", "lastName", "phone", "carMake", "carType", "carColor", "carYear", "serviceType", "appointmentDate", "appointmentTime"];
    for (const k of required) {
      if (!payload[k as keyof AppointmentPayload]) {
        return res.status(400).json({ error: `${k} is required.` });
      }
    }

    // Enforce single service
    if (Array.isArray((payload as any).serviceType)) {
      return res.status(400).json({ error: "Only one service may be submitted." });
    }

    // Blackout check
    const blackout = await isBlackout(payload.appointmentDate, payload.appointmentTime);
    if (blackout) {
      return res.status(409).json({ error: "Requested appointment falls within a blackout rule." });
    }

    // Determine sheet
    const sheetName = getSheetForDate(payload.appointmentDate);

    // Load workbook and compute next ID
    const workbook = await loadWorkbook();
    const sheet = getSheet(workbook, sheetName);
    const rows = sheetToJson(sheet) as any[];
    const nextId = nextIdFromRows(rows);

    const dateSubmitted = new Date().toLocaleDateString();

    const row: ExcelRow = {
      ID: nextId,
      FirstName: payload.firstName,
      LastName: payload.lastName,
      Phone: payload.phone,
      Email: payload.email || "",
      CarMake: payload.carMake,
      CarType: payload.carType,
      CarColor: payload.carColor,
      CarYear: payload.carYear,
      ServiceType: payload.serviceType,
      DateSubmitted: dateSubmitted,
      AppointmentDate: formatAppointmentDateForExcel(payload.appointmentDate),
    };

    await appendToSheet(sheetName, row);

    return res.json({ success: true, id: nextId });
  } catch (err: any) {
    console.error("submitRoute error:", err);
    return res.status(500).json({ error: err?.message || "Internal server error" });
  }
});

export default router;
