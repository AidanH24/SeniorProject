"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar');
    const monthTitle = document.getElementById('monthTitle');
    const appointmentsEl = document.getElementById('appointments');
    const detailsEl = document.getElementById('details');
    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const currentYear = now.getFullYear();
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const data = {
        3: [
            { time: '8:00 AM', customer: 'Mike Davis', phone: '555-444-5555', email: 'mike@example.com', services: 'Battery Replacement', vehicle: '2019 Chevy Malibu', finished: true },
            { time: '10:00 AM', customer: 'Sarah Wilson', phone: '555-666-7777', email: 'sarah@example.com', services: 'Oil Change', vehicle: '2021 Hyundai Elantra', finished: true }
        ],
        10: [
            { time: '9:00 AM', customer: 'John Doe', phone: '555-123-4567', email: 'john@example.com', services: 'Oil Change', vehicle: '2020 Honda Civic', finished: false },
            { time: '10:00 AM', customer: 'Jane Smith', phone: '555-987-6543', email: 'jane@example.com', services: 'Tire Repair', vehicle: '2018 Toyota Camry', finished: false },
            { time: '11:00 AM', customer: 'Robert Johnson', phone: '555-222-3333', email: 'robert@example.com', services: 'Inspection', vehicle: '2022 Ford F-150', finished: false }
        ],
        15: [
            { time: '9:00 AM', customer: 'Lisa Brown', phone: '555-888-9999', email: 'lisa@example.com', services: 'Brake Repair', vehicle: '2017 Nissan Altima', finished: false },
            { time: '1:00 PM', customer: 'Tom Garcia', phone: '555-111-2222', email: 'tom@example.com', services: 'Tire Rotation', vehicle: '2023 Toyota RAV4', finished: true }
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
            const header = document.createElement('div');
            header.className = 'day-header';
            header.textContent = dayNames[d];
            calendarEl.appendChild(header);
        }
        const days = getDaysInMonth(currentMonthIndex, currentYear);
        const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay();
        for (let blank = 0; blank < firstDay; blank++) {
            const empty = document.createElement('div');
            calendarEl.appendChild(empty);
        }
        const today = now.getDate();
        for (let i = 1; i <= days; i++) {
            const day = document.createElement('div');
            day.className = 'day';
            if (i === today) {
                day.classList.add('today');
            }
            day.textContent = String(i);
            const dayAppts = data[i] || [];
            const count = dayAppts.length;
            if (count > 0) {
                const allDone = dayAppts.every(a => a.finished);
                if (allDone) {
                    day.classList.add('all-finished');
                }
                const badge = document.createElement('span');
                badge.className = 'appt-count';
                badge.textContent = count + ' Appt' + (count > 1 ? 's' : '');
                day.appendChild(badge);
            }
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
        const heading = document.createElement('div');
        heading.className = 'day-heading';
        heading.textContent = `Appointments for ${months[currentMonthIndex]} ${dayNum}, ${currentYear}`;
        appointmentsEl.appendChild(heading);
        const appts = (data[dayNum] || []).sort((a, b) => {
            return new Date('1/1/2000 ' + a.time).getTime() - new Date('1/1/2000 ' + b.time).getTime();
        });
        const total = appts.length;
        const finishedCount = appts.filter(a => a.finished).length;
        const unfinishedCount = total - finishedCount;
        const summary = document.createElement('div');
        summary.className = 'summary';
        summary.textContent = `${total} total — ${unfinishedCount} unfinished, ${finishedCount} finished`;
        appointmentsEl.appendChild(summary);
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
      <p><strong>Vehicle:</strong> ${appt.vehicle}</p>
      <p><strong>Services:</strong> ${appt.services}</p>
      <p><strong>Status:</strong> ${appt.finished ? 'Finished' : 'Unfinished'}</p>
      <button class="btn-finish">${appt.finished ? 'Unfinished' : 'Finished'}</button>
      <button class="btn-reschedule">Reschedule</button>
    `;
        const finishBtn = detailsEl.querySelector('.btn-finish');
        finishBtn.onclick = () => {
            const message = appt.finished
                ? 'Mark this appointment as unfinished?'
                : 'Mark this appointment as finished?';
            if (!confirm(message))
                return;
            data[dayNum][index].finished = !data[dayNum][index].finished;
            renderCalendar();
            renderAppointments(dayNum);
            showDetails(data[dayNum][index], dayNum, index);
        };
        const rescheduleBtn = detailsEl.querySelector('.btn-reschedule');
        rescheduleBtn.onclick = () => {
            const rescheduleData = {
                customer: appt.customer,
                phone: appt.phone,
                email: appt.email,
                vehicle: appt.vehicle,
                services: appt.services,
                originalDay: dayNum,
                originalTime: appt.time,
                originalMonth: months[currentMonthIndex],
                originalYear: currentYear
            };
            sessionStorage.setItem('rescheduleAppt', JSON.stringify(rescheduleData));
            window.location.href = 'reschedulePage.html';
        };
    }
    renderCalendar();
    const todayEl = document.querySelector('.day.today');
    if (todayEl) {
        todayEl.click();
    }
});
