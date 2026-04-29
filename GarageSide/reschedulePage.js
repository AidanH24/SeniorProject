"use strict";
const rescheduleMonthSelect = document.getElementById('monthSelect');
const rescheduleDaySelect = document.getElementById('daySelect');
const rescheduleTimeSelect = document.getElementById('timeSelect');
const rescheduleSummary = document.getElementById('summary');
const rescheduleMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
function rescheduleTimeOptions() {
    const startHour = 8;
    const endHour = 16;
    rescheduleTimeSelect.innerHTML = '';
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
            rescheduleTimeSelect.appendChild(option);
        }
    }
}
function updateRescheduleDaysForMonth() {
    const monthIndex = rescheduleMonthSelect.selectedIndex;
    const now = new Date();
    const year = now.getFullYear();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    rescheduleDaySelect.innerHTML = '';
    for (let d = 1; d <= daysInMonth; d++) {
        const option = document.createElement('option');
        option.value = String(d);
        option.textContent = String(d);
        rescheduleDaySelect.appendChild(option);
    }
}
function populateRescheduleMonths() {
    rescheduleMonthSelect.innerHTML = '';
    rescheduleMonths.forEach((m, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = m;
        rescheduleMonthSelect.appendChild(option);
    });
    rescheduleMonthSelect.selectedIndex = new Date().getMonth();
    updateRescheduleDaysForMonth();
}
function saveRescheduleDateTimeToSessionStorage() {
    const selectedMonth = rescheduleMonths[rescheduleMonthSelect.selectedIndex];
    const selectedDay = rescheduleDaySelect.value;
    const selectedTime = rescheduleTimeSelect.value;
    const monthIndex = rescheduleMonthSelect.selectedIndex;
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
const confirmRescheduleBtn = document.getElementById('confirmBtn');
confirmRescheduleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    saveRescheduleDateTimeToSessionStorage();
    // Navigate to confirmation page (update the path as needed)
    window.location.href = '../ConfirmationPage/confirmationPage.html';
});
function displayRescheduleInfo() {
    const stored = sessionStorage.getItem('rescheduleAppt');
    if (stored) {
        const appt = JSON.parse(stored);
        rescheduleSummary.innerHTML = `<strong>Rescheduling:</strong> ${appt.customer} - ${appt.services} (${appt.originalMonth} ${appt.originalDay}, ${appt.originalTime})`;
    }
}
function initReschedulePage() {
    populateRescheduleMonths();
    rescheduleTimeOptions();
    displayRescheduleInfo();
    rescheduleMonthSelect.addEventListener('change', updateRescheduleDaysForMonth);
}
initReschedulePage();
