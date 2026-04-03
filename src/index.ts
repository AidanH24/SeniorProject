import express from 'express';
import path from 'path';
import { appendAppointment } from './dbConnect';

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve public files (CSS, frontend JS, images)
app.use(express.static(path.join(__dirname, '../public')));

// Main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/aboutyou.html'));
});

// Endpoint to add appointment data to Excel (database)
app.post('/api/appointments', (req, res) => {
  try {
    const payload = req.body;

    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ message: 'Appointment payload required' });
    }

    appendAppointment(payload);
    return res.status(201).json({ message: 'Appointment saved' });
  } catch (error) {
    console.error('Error writing to Excel:', error);
    return res.status(500).json({ message: 'Failed to save appointment' });
  }
});

// Protected placeholder middleware (replace with real auth for production)
function isAuthenticated(req: any, res: any, next: any) {
  const loggedIn = true;
  if (loggedIn) {
    return next();
  }
  return res.status(401).send('Unauthorized');
}

app.get('/garage', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../protectedPages/GarageSide/GarageCalender.html'));
});

app.get('/reschedule', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../protectedPages/GarageSide/reschedulePage.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});