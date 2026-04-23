interface Appointment {
  time: string;
  customer: string;
  phone: string;
  email: string;
  services: string;
  vehicle: string;
  finished: boolean;
}

interface AppointmentData {
  [day: number]: Appointment[];
}

document.addEventListener('DOMContentLoaded', (): void => {
  const calendarEl = document.getElementById('calendar') as HTMLDivElement;
  const monthTitle = document.getElementById('monthTitle') as HTMLDivElement;
  const appointmentsEl = document.getElementById('appointments') as HTMLDivElement;
  const detailsEl = document.getElementById('details') as HTMLDivElement;

  const now = new Date();
  const currentMonthIndex: number = now.getMonth();
  const currentYear: number = now.getFullYear();

  const months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const data: AppointmentData = {
    10: [
      { time: '9:00 AM', customer: 'John Doe', phone: '555-123-4567', email: 'john@example.com', services: 'Oil Change', vehicle: '2020 Honda Civic', finished: false },
      { time: '10:00 AM', customer: 'Jane Smith', phone: '555-987-6543', email: 'jane@example.com', services: 'Tire Repair', vehicle: '2018 Toyota Camry', finished: false },
      { time: '11:00 AM', customer: 'Robert Johnson', phone: '555-222-3333', email: 'robert@example.com', services: 'Inspection', vehicle: '2022 Ford F-150', finished: false }
    ]
  };

  function getDaysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  const dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function renderCalendar(): void {
    calendarEl.innerHTML = '';
    monthTitle.textContent = months[currentMonthIndex] + ' ' + currentYear;

    for (let d = 0; d < dayNames.length; d++) {
      const header: HTMLDivElement = document.createElement('div');
      header.className = 'day-header';
      header.textContent = dayNames[d];
      calendarEl.appendChild(header);
    }

    const days: number = getDaysInMonth(currentMonthIndex, currentYear);
    const firstDay: number = new Date(currentYear, currentMonthIndex, 1).getDay();

    for (let blank = 0; blank < firstDay; blank++) {
      const empty: HTMLDivElement = document.createElement('div');
      calendarEl.appendChild(empty);
    }

    const today: number = now.getDate();

    for (let i = 1; i <= days; i++) {
      const day: HTMLDivElement = document.createElement('div');
      day.className = 'day';
      if (i === today) {
        day.classList.add('today');
      }
      day.textContent = String(i);

      const count: number = (data[i] || []).length;
      if (count > 0) {
        const badge: HTMLSpanElement = document.createElement('span');
        badge.className = 'appt-count';
        badge.textContent = count + ' Appt' + (count > 1 ? 's' : '');
        day.appendChild(badge);
      }

      day.onclick = (): void => selectDay(i, day);

      calendarEl.appendChild(day);
    }
  }

  function selectDay(dayNum: number, el: HTMLDivElement): void {
    document.querySelectorAll('.day').forEach((d: Element) => d.classList.remove('selected'));
    el.classList.add('selected');
    renderAppointments(dayNum);
  }

  function renderAppointments(dayNum: number): void {
    appointmentsEl.innerHTML = '';
    detailsEl.style.display = 'none';

    const appts: Appointment[] = (data[dayNum] || []).sort((a, b) => {
      return new Date('1/1/2000 ' + a.time).getTime() - new Date('1/1/2000 ' + b.time).getTime();
    });

    const total: number = appts.length;
    const finishedCount: number = appts.filter(a => a.finished).length;
    const unfinishedCount: number = total - finishedCount;

    const summary: HTMLDivElement = document.createElement('div');
    summary.className = 'summary';
    summary.textContent = `${total} total — ${unfinishedCount} unfinished, ${finishedCount} finished`;
    appointmentsEl.appendChild(summary);

    appts.forEach((appt: Appointment, index: number) => {
      const div: HTMLDivElement = document.createElement('div');
      div.className = 'appointment ' + (appt.finished ? 'finished' : 'unfinished');
      div.textContent = `${appt.time} - ${appt.customer}`;

      div.onclick = (): void => showDetails(appt, dayNum, index);

      appointmentsEl.appendChild(div);
    });
  }

  function showDetails(appt: Appointment, dayNum: number, index: number): void {
    detailsEl.style.display = 'block';
    detailsEl.innerHTML = `
      <p><strong>Customer:</strong> ${appt.customer}</p>
      <p><strong>Phone:</strong> ${appt.phone}</p>
      <p><strong>Email:</strong> ${appt.email}</p>
      <p><strong>Vehicle:</strong> ${appt.vehicle}</p>
      <p><strong>Services:</strong> ${appt.services}</p>
      <button class="btn-finish">${appt.finished ? 'Unfinished' : 'Finished'}</button>
      <button class="btn-reschedule">Reschedule</button>
    `;

    const finishBtn = detailsEl.querySelector('.btn-finish') as HTMLButtonElement;

    finishBtn.onclick = (): void => {
      const message = appt.finished
        ? 'Mark this appointment as unfinished?'
        : 'Mark this appointment as finished?';
      if (!confirm(message)) return;
      data[dayNum][index].finished = !data[dayNum][index].finished;
      renderAppointments(dayNum);
      showDetails(data[dayNum][index], dayNum, index);
    };
  }

  renderCalendar();

  const todayEl = document.querySelector('.day.today') as HTMLDivElement | null;
  if (todayEl) {
    todayEl.click();
  }
});