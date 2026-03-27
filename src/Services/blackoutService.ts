// src/blackoutService.ts
import { loadWorkbook, getSheet, sheetToJson } from "./excelService";
import { BlackoutRule } from "../types";

/** Parse time like "10:15 AM" into minutes since midnight */
function timeStringToMinutes(t?: string): number | null {
  if (!t) return null;
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return null;
  let hour = Number(m[1]);
  const minute = Number(m[2]);
  const ampm = m[3]?.toUpperCase();
  if (ampm) {
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
  }
  return hour * 60 + minute;
}

function dateOnly(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Returns true if the appointment (date + time) falls inside any blackout rule.
 * appointmentDateStr should be parseable by Date (e.g., "2026-03-30")
 * appointmentTimeStr should be like "10:15 AM"
 */
export async function isBlackout(appointmentDateStr: string, appointmentTimeStr?: string): Promise<boolean> {
  const workbook = await loadWorkbook();
  const sheet = getSheet(workbook, "BlackoutRules");
  const rows = sheetToJson(sheet) as BlackoutRule[];

  const apptDate = new Date(appointmentDateStr);
  if (isNaN(apptDate.getTime())) {
    throw new Error("Invalid appointment date for blackout check.");
  }
  const apptDateOnly = dateOnly(apptDate);
  const apptMinutes = appointmentTimeStr ? timeStringToMinutes(appointmentTimeStr) : null;

  for (const r of rows) {
    if (!r.StartDate || !r.EndDate) continue;

    const start = new Date(r.StartDate);
    const end = new Date(r.EndDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) continue;

    const startDateOnly = dateOnly(start);
    const endDateOnly = dateOnly(end);

    // If appointment date is outside the date range, skip
    if (apptDateOnly < startDateOnly || apptDateOnly > endDateOnly) {
      continue;
    }

    // If rule has no time bounds, the whole date range is blocked
    if (!r.StartTime && !r.EndTime) {
      return true;
    }

    // If rule has time bounds, check time overlap
    if (apptMinutes === null) {
      // frontend didn't provide time; treat as blocked if date is within range and rule has times
      return true;
    }

    const ruleStartMin = timeStringToMinutes(r.StartTime);
    const ruleEndMin = timeStringToMinutes(r.EndTime);
    if (ruleStartMin === null || ruleEndMin === null) {
      // malformed rule times — treat as full-day blackout
      return true;
    }

    if (apptMinutes >= ruleStartMin && apptMinutes <= ruleEndMin) {
      return true;
    }
  }

  return false;
}
