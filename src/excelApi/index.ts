// src/excelApi/index.ts
import express from 'express';
import { appendAppointment } from './excelWriter';

const router = express.Router();

function validateAndNormalize(payload: any) {
  const required = ['FirstName', 'LastName', 'AppointmentDate', 'Time', 'ServiceType'];
  for (const k of required) {
    if (!payload?.[k] || String(payload[k]).trim() === '') {
      throw new Error(`Missing required field: ${k}`);
    }
  }

  const normalized: Record<string, any> = {
    FirstName: String(payload.FirstName).trim(),
    LastName: String(payload.LastName).trim(),
    Phone: payload.Phone ? String(payload.Phone).trim() : '',
    Email: payload.Email ? String(payload.Email).trim() : '',
    CarMake: payload.CarMake ? String(payload.CarMake).trim() : '',
    CarType: payload.CarType ? String(payload.CarType).trim() : '',
    CarColor: payload.CarColor ? String(payload.CarColor).trim() : '',
    CarYear: payload.CarYear ? Number(payload.CarYear) : '',
    ServiceType: String(payload.ServiceType).trim(),
    AppointmentDate: String(payload.AppointmentDate).trim(),
    Time: String(payload.Time).trim(),
  };

  try {
    const iso = new Date(`${normalized.AppointmentDate} ${normalized.Time}`);
    if (!isNaN(iso.getTime())) normalized.AppointmentISO = iso.toISOString();
  } catch (e) {}

  return normalized;
}

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/appointments', async (req, res) => {
  try {
    const payload = validateAndNormalize(req.body);
    await appendAppointment(payload);
    return res.status(201).json({ message: 'Appointment saved' });
  } catch (err: any) {
    console.error('Error writing to Excel:', err);
    const status = err.message && err.message.startsWith('Missing') ? 400 : 500;
    return res.status(status).json({ message: err.message || 'Failed to save appointment' });
  }
});

export default router;
