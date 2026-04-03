"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dbConnect_1 = require("./dbConnect");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 3000);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve public files (CSS, frontend JS, images)
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Main page
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/aboutYouPage.html'));
});
// Endpoint to add appointment data to Excel (database)
app.post('/api/appointments', (req, res) => {
    try {
        const payload = req.body;
        if (!payload || Object.keys(payload).length === 0) {
            return res.status(400).json({ message: 'Appointment payload required' });
        }
        (0, dbConnect_1.appendAppointment)(payload);
        return res.status(201).json({ message: 'Appointment saved' });
    }
    catch (error) {
        console.error('Error writing to Excel:', error);
        return res.status(500).json({ message: 'Failed to save appointment' });
    }
});
// Protected placeholder middleware (replace with real auth for production)
function isAuthenticated(req, res, next) {
    const loggedIn = true;
    if (loggedIn) {
        return next();
    }
    return res.status(401).send('Unauthorized');
}
app.get('/garage', isAuthenticated, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../protectedPages/GarageSide/GarageCalender.html'));
});
app.get('/reschedule', isAuthenticated, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../protectedPages/GarageSide/reschedulePage.html'));
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
