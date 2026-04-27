"use strict";
document.addEventListener('DOMContentLoaded',  async() => {
    const calendarEl = document.getElementById('calendar');
    const monthTitle = document.getElementById('monthTitle');
    const appointmentsEl = document.getElementById('appointments');
    const detailsEl = document.getElementById('details');
    const downloadBtn = document.getElementById("downloadExcelBtn");
    let appointmentData = {};
    let blackoutDates = [];


    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            window.location.href = "/api/download-excel";
        });
    }
    const now = new Date();
    let viewMonth = now.getMonth();
    let viewYear = now.getFullYear();

    async function loadAppointmentsForViewMonth() {
        const res = await fetch(`/api/appointments?month=${viewMonth}&year=${viewYear}`);
        appointmentData = await res.json();
    }

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    function getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    async function loadAppointments() {
        try {
            const res = await fetch("/api/appointments");
            appointmentData = await res.json();
            console.log("Loaded appointments:", appointmentData);
        } catch (err) {
            console.error("Failed to load appointments", err);
        }
    }

    async function loadBlackoutDays() {
        try {
            const res = await fetch("/api/blackout-days");
            const data = await res.json();
            blackoutDates = data.blackoutDates || [];
        } catch (err) {
            console.error("Failed to load blackout days", err);
            blackoutDates = [];
        }
    }
    

    
    function renderCalendar() {
        calendarEl.innerHTML = '';
    
        // Correct month title
        monthTitle.textContent = months[viewMonth] + ' ' + viewYear;
    
        // Day headers
        for (let d = 0; d < dayNames.length; d++) {
            const header = document.createElement('div');
            header.className = 'day-header';
            header.textContent = dayNames[d];
            calendarEl.appendChild(header);
        }
    
        const days = getDaysInMonth(viewMonth, viewYear);
        const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    
        // Blank cells before day 1
        for (let blank = 0; blank < firstDay; blank++) {
            const empty = document.createElement('div');
            calendarEl.appendChild(empty);
        }
    
        const today = now.getDate();
    
        for (let i = 1; i <= days; i++) {
            const day = document.createElement('div');
            day.className = 'day';
        
            if (
                i === today &&
                viewMonth === now.getMonth() &&
                viewYear === now.getFullYear()
            ) {
                day.classList.add('today');
            }
        
            day.textContent = String(i);
        
            // Disable Sundays
            const dayOfWeek = new Date(viewYear, viewMonth, i).getDay();
            if (dayOfWeek === 0) {
                day.classList.add('disabled-day');
                day.onclick = null;
            }
        
            // Disable blackout dates from Excel
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            if (blackoutDates.includes(dateStr)) {
                day.classList.add('disabled-day');
                day.onclick = null;
            }
        
            const count = (appointmentData[i] || []).length;
            if (count > 0) {
                const badge = document.createElement('span');
                badge.className = 'appt-count';
                badge.textContent = count + ' Appt' + (count > 1 ? 's' : '');
                day.appendChild(badge);
            }
        
            day.onclick = () => selectDay(i, day);
            calendarEl.appendChild(day);
        }
    }
    
    // INITIAL LOAD
    await loadBlackoutDays();
    await loadAppointmentsForViewMonth();
    renderCalendar();
    
    function selectDay(dayNum, el) {
        document.querySelectorAll('.day').forEach((d) => d.classList.remove('selected'));
        el.classList.add('selected');
        renderAppointments(dayNum);
    }
    function renderAppointments(dayNum) {
        appointmentsEl.innerHTML = '';
        detailsEl.style.display = 'none';
        const appts = (appointmentData[dayNum] || []).sort((a, b) => {
            return new Date('1/1/2000 ' + a.time).getTime() -
                   new Date('1/1/2000 ' + b.time).getTime();
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
            div.onclick = () => {
                document.querySelectorAll('.appointment').forEach(a => a.classList.remove('selected-appointment'));
                div.classList.add('selected-appointment');
                showDetails(appt, dayNum, index);
            };            
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
      <button class="btn-finish">${appt.finished ? 'Mark Incomplete' : 'Completed'}</button>
      <button class="btn-reschedule">Reschedule</button>
    `;
        const finishBtn = detailsEl.querySelector('.btn-finish');
        finishBtn.onclick = () => {
            const message = appt.finished
                ? 'Mark this appointment as Incomplete?'
                : 'Mark this appointment as Completed?';
            if (!confirm(message))
                return;
            appointmentData[dayNum][index].finished = !appointmentData[dayNum][index].finished;
            renderAppointments(dayNum);
            showDetails(appointmentData[dayNum][index], dayNum, index);
        };
    }
    document.getElementById("prevMonth").onclick = async () => {
        viewMonth--;
        if (viewMonth < 0) {
            viewMonth = 11;
            viewYear--;
        }
        await loadAppointmentsForViewMonth();
        renderCalendar();
    };
    
    document.getElementById("nextMonth").onclick = async () => {
        viewMonth++;
        if (viewMonth > 11) {
            viewMonth = 0;
            viewYear++;
        }
        await loadAppointmentsForViewMonth();
        renderCalendar();
    };
    
    await loadAppointmentsForViewMonth();
    renderCalendar();


    const todayEl = document.querySelector('.day.today');
    if (todayEl) {
        todayEl.click();
    }
});
