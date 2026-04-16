"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar');
    const monthTitle = document.getElementById('monthTitle');
    const appointmentsEl = document.getElementById('appointments');
    const detailsEl = document.getElementById('details');
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
    const data = {
        10: [
            { time: '9:00 AM', customer: 'John Doe', phone: '555-123-4567', email: 'john@example.com', services: 'Oil Change', finished: false },
            { time: '10:00 AM', customer: 'Jane Smith', phone: '555-987-6543', email: 'jane@example.com', services: 'Tire Repair', finished: false },
            { time: '11:00 AM', customer: 'Robert Johnson', phone: '555-222-3333', email: 'robert@example.com', services: 'Inspection', finished: false }
        ]
    };
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
        const appts = data[dayNum] || [];
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
            data[dayNum][index].finished = !data[dayNum][index].finished;
            renderAppointments(dayNum);
            showDetails(data[dayNum][index], dayNum, index);
        };
    }
    renderCalendar();
});
