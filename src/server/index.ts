import express from 'express';
import path from 'path';
import excelRouter from '../excelApi/index';
import * as XLSX from "xlsx";
import { 
  EXCEL_PATH, 
  getSheetNameForAppointment, 
  downloadExcelFromGitHub 
} from "../excelApi/excelWriter";

const app = express();
const port = Number(process.env.PORT || process.env.APP_PORT || 3000);
const host = '0.0.0.0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));

// Mount excelApi under /api
app.use('/api', excelRouter);

// ------------------------------
//  API: Load appointments for calendar
// ------------------------------
app.get("/api/appointments", async (req, res) => {
  try {
    const { workbook } = await downloadExcelFromGitHub();

    // Read month/year from query
    const month = Number(req.query.month); // 0–11
    const year = Number(req.query.year);

    // If no month/year provided, default to current month
    const targetDate = new Date(
      isNaN(year) ? new Date().getFullYear() : year,
      isNaN(month) ? new Date().getMonth() : month,
      1
    );

    // Convert to sheet name
    const sheetName = getSheetNameForAppointment(targetDate.toISOString());
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) return res.json({});

    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const grouped: Record<number, any[]> = {};

    for (const row of rows) {
      if (!row.AppointmentDate) continue;

      const date = new Date(row.AppointmentDate);
      const day = date.getDate();

      if (!grouped[day]) grouped[day] = [];

      grouped[day].push({
        time: row.Time,
        customer: `${row.FirstName} ${row.LastName}`,
        phone: row.Phone,
        email: row.Email,
        services: row.ServiceType,
        vehicle: `${row.CarYear} ${row.CarColor} ${row.CarMake} ${row.CarType}`,
        finished: false
      });
    }

    res.json(grouped);

  } catch (err) {
    console.error("Error loading appointments:", err);
    res.status(500).json({ error: "Failed to load appointments" });
  }
});



// ------------------------------
//  AUTH + PAGE ROUTES
// ------------------------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/aboutYouPage.html'));
});

function isAuthenticated(req: any, res: any, next: any) {
  const loggedIn = true;
  if (loggedIn) return next();
  return res.status(401).send('Unauthorized');
}

app.get('/garage', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../../protectedPages/GarageSide/GarageCalendar.html'));
});

app.get('/reschedule', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../../protectedPages/GarageSide/reschedulePage.html'));
});

// ------------------------------
//  API: Download Excel
// ------------------------------
app.get("/api/download-excel", (req, res) => {
  const filePath = path.join(__dirname, "../../Data/AutoData.xlsx");

  res.download(filePath, "AutoData.xlsx", (err) => {
    if (err) {
      console.error("Error sending Excel file:", err);
      res.status(500).send("Error downloading file");
    }
  });
});

// ------------------------------
//  API: Taken times (NEEDS FIX NEXT)
// ------------------------------
app.get("/api/appointments/taken-times", async (req, res) => {
  const date = req.query.date as string;
  if (!date) return res.status(400).json({ error: "date required" });

  try {
    const { workbook } = await downloadExcelFromGitHub();

    const sheetName = getSheetNameForAppointment(date + "T00:00:00");
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) return res.json({ takenTimes: [] });

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const takenTimes = rows
      .filter((r: any) => r.AppointmentDate === date)
      .map((r: any) => r.Time);

    res.json({ takenTimes });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load taken times" });
  }
});
//Route Get Blackout dates
app.get("/api/blackout-days", async (req, res) => {
  try {
      const { workbook } = await downloadExcelFromGitHub();
      const sheet = workbook.Sheets["BlackoutRules"];

      if (!sheet) return res.json({ blackoutDates: [] });

      // Define the expected row structure
      interface BlackoutRow {
          ID?: string | number;
          StartDate?: string;
          EndDate?: string;
          StartTime?: string;
          EndTime?: string;
          Sundays?: string;
      }

      // Tell TypeScript what type the rows are
      const rows = XLSX.utils.sheet_to_json<BlackoutRow>(sheet, { defval: "" });

      const blackoutDates: string[] = [];

      for (const row of rows) {
          if (!row.StartDate) continue;

          const start = new Date(row.StartDate);
          const end = row.EndDate ? new Date(row.EndDate) : new Date(row.StartDate);

          // Expand date range
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              blackoutDates.push(d.toISOString().split("T")[0]);
          }
      }

      res.json({ blackoutDates });

  } catch (err) {
      console.error("Failed to load blackout days:", err);
      res.status(500).json({ blackoutDates: [] });
  }
});



// ------------------------------
console.log('=== STARTUP DIAGNOSTIC ===');
console.log('cwd:', process.cwd());
console.log('node:', process.version);
console.log('PORT env:', process.env.PORT);
console.log('APP_PORT env:', process.env.APP_PORT);

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
