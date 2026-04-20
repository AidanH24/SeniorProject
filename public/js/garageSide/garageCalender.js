"use strict";
let appointmentData = {};

async function loadAppointments() {
        try {
            const res = await fetch("/api/appointments");
            appointmentData = await res.json();
            console.log("Loaded appointments:", appointmentData);
        } catch (err) {
            console.error("Failed to load appointments", err);
        }
    }

document.addEventListener('DOMContentLoaded', async() => {
    const calendarEl = document.getElementById('calendar');
    const monthTitle = document.getElementById('monthTitle');
    const appointmentsEl = document.getElementById('appointments');
    const detailsEl = document.getElementById('details');
    await loadAppointments();
    renderCalendar();
    const downloadBtn = document.getElementById("downloadExcelBtn");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            window.location.href = "/api/download-excel";
        });
    }
    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const currentYear = now.getFullYear();
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    function getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    
    
    function renderCalendar() {
        calendarEl.innerHTML = '';
        monthTitle.textContent = months[currentMonthIndex] + ' ' + currentYear;
        for (let d = 0; d < dayNames.length; d++) {
            const dayNameEl = document.createElement('div');
            dayNameEl.className = 'day-name';
            dayNameEl.textContent = dayNames[d];
            calendarEl.appendChild(dayNameEl);
        }
        const days = getDaysInMonth(currentMonthIndex, currentYear);
        const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay();
        for (let blank = 0; blank < firstDay; blank++) {
            const empty = document.createElement('div');
            calendarEl.appendChild(empty);
        }
        const today = new Date().getDate();
        for (let i = 1; i <= days; i++) {
            const day = document.createElement('div');
            day.className = 'day';
            if (i === today) {
                day.classList.add('today');
            }
            day.textContent = String(i);
            day.onclick = () => selectDay(i, day);
            calendarEl.appendChild(day);
        }
    }
    function selectDay(dayNum, el) {
        document.querySelectorAll('.day').forEach((d) => d.classList.remove('selected'));
        el.classList.add('selected');
        renderAppointments(dayNum);
    }
    function renderAppointments(dayNum) {
        appointmentsEl.innerHTML = '';
        detailsEl.style.display = 'none';
        const appts = appointmentData[dayNum] || [];
        appts.forEach((appt, index) => {
            const div = document.createElement('div');
            div.className = 'appointment ' + (appt.finished ? 'finished' : 'unfinished');
            div.textContent = `${appt.time} - ${appt.customer}`;
            div.onclick = () => showDetails(appt, dayNum, index);
            appointmentsEl.appendChild(div);
        });
    }
    function showDetails(appt, dayNum, index) {
        detailsEl.style.display = 'block';
        detailsEl.innerHTML = `
      <p><strong>Customer:</strong> ${appt.customer}</p>
      <p><strong>Phone:</strong> ${appt.phone}</p>
      <p><strong>Email:</strong> ${appt.email}</p>
      <p><strong>Services:</strong> ${appt.services}</p>
      <button class="btn-finish">Finished</button>
      <button class="btn-reschedule">Reschedule</button>
    `;
        const finishBtn = detailsEl.querySelector('.btn-finish');
        finishBtn.onclick = () => {
            appointmentData[dayNum][index].finished = !appointmentData[dayNum][index].finished;
            renderAppointments(dayNum);
            showDetails(appointmentData[dayNum][index], dayNum, index);            
        };
    }
});
