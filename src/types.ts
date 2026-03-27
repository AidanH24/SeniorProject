// src/types.ts

export interface AppointmentPayload {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  
    carMake: string;
    carType: string;
    carColor: string;
    carYear: string;
  
    serviceType: string; // single service only
  
    appointmentDate: string; // parseable date string, e.g., "2026-03-30"
    appointmentTime: string; // formatted time, e.g., "10:15 AM"
  
    dateSubmitted?: string; // optional; server will set if missing
  }
  
  export interface ExcelRow {
    ID: number | string;
    FirstName: string;
    LastName: string;
    Phone: string;
    Email?: string;
    CarMake: string;
    CarType: string;
    CarColor: string;
    CarYear: string;
    ServiceType: string;
    DateSubmitted: string;
    AppointmentDate: string; // formatted for Excel, e.g., "3/30/2026"
  }
  
  export interface BlackoutRule {
    ID?: number | string;
    StartDate: string; // date string parseable by Date
    EndDate: string;   // date string parseable by Date
    StartTime?: string; // optional, e.g., "08:00 AM"
    EndTime?: string;   // optional, e.g., "05:00 PM"
  }
  