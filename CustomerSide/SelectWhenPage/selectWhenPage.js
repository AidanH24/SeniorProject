"use strict";
const monthSelect = document.getElementById('monthSelect');
const daySelect = document.getElementById('daySelect');
const timeSelect = document.getElementById('timeSelect');
const summary = document.getElementById('summary');
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
function createTimeOptions() {
    const startHour = 8;
    const endHour = 16;
    timeSelect.innerHTML = '';
    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            if (hour === endHour && minute > 45)
                continue;
            const suffix = hour < 12 ? 'AM' : 'PM';
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            const minuteString = minute < 10 ? `0${minute}` : `${minute}`;
            const label = `${displayHour}:${minuteString} ${suffix}`;
            const option = document.createElement('option');
            option.value = label;
            option.textContent = label;
            timeSelect.appendChild(option);
        }
    }
}
function updateDaysForMonth() {
    const monthIndex = monthSelect.selectedIndex;
    const now = new Date();
    const year = now.getFullYear();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    daySelect.innerHTML = '';
    for (let d = 1; d <= daysInMonth; d++) {
        const option = document.createElement('option');
        option.value = String(d);
        option.textContent = String(d);
        daySelect.appendChild(option);
    }
}
function populateMonths() {
    monthSelect.innerHTML = '';
    months.forEach((m, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = m;
        monthSelect.appendChild(option);
    });
    monthSelect.selectedIndex = new Date().getMonth();
    updateDaysForMonth();
}
function saveDateTimeToSessionStorage() {
    const selectedMonth = months[monthSelect.selectedIndex];
    const selectedDay = daySelect.value;
    const selectedTime = timeSelect.value;
    const monthIndex = monthSelect.selectedIndex;
    const year = new Date().getFullYear();
    // Create a Date object to calculate the day of week
    const selectedDate = new Date(year, monthIndex, parseInt(selectedDay));
    const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' });
    const appointmentData = {
        month: selectedMonth,
        day: selectedDay,
        dayOfWeek: dayOfWeek,
        time: selectedTime
    };
    sessionStorage.setItem('appointmentData', JSON.stringify(appointmentData));
}
const confirmBtn = document.getElementById('confirmBtn');
confirmBtn.addEventListener('click', (e) => {
    e.preventDefault();
    saveDateTimeToSessionStorage();
    // Navigate to confirmation page (update the path as needed)
    window.location.href = '../ConfirmationPage/confirmationPage.html';
});
const backBtn = document.getElementById('backBtn');
backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Navigate back to services page (update the path as needed)
    window.location.href = '../ServicesPage/servicesPage.html';
});
function initSelectWhenPage() {
    populateMonths();
    createTimeOptions();
    monthSelect.addEventListener('change', updateDaysForMonth);
}
initSelectWhenPage();
