// src/server/index.ts
import express from 'express';
import path from 'path';
import excelRouter from '../excelApi/index';

const app = express();
const port = Number(process.env.PORT || process.env.APP_PORT || 3000);
const host = '0.0.0.0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../../public')));

// Mount excelApi under /api
app.use('/api', excelRouter);

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

console.log('=== STARTUP DIAGNOSTIC ===');
console.log('cwd:', process.cwd());
console.log('node:', process.version);
console.log('PORT env:', process.env.PORT);
console.log('APP_PORT env:', process.env.APP_PORT);

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
