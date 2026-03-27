// src/sheetSelector.ts
export function getSheetForDate(dateString: string): string {
    const appointmentDate = new Date(dateString);
    if (isNaN(appointmentDate.getTime())) {
      throw new Error("Invalid appointment date format.");
    }
  
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0–11
  
    const apptYear = appointmentDate.getFullYear();
    const apptMonth = appointmentDate.getMonth();
  
    const diff = (apptYear - currentYear) * 12 + (apptMonth - currentMonth);
  
    switch (diff) {
      case -1:
        return "LastMonth";
      case 0:
        return "ThisMonth";
      case 1:
        return "NextMonth";
      case 2:
        return "Month+2";
      case 3:
        return "Month+3";
      default:
        throw new Error(
          `Appointment date is outside the allowed 5-month window. Month difference: ${diff}`
        );
    }
  }
  