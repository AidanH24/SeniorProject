interface Appointment {
  time: string;
  customer: string;
  phone: string;
  email: string;
  services: string;
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
      { time: '9:00 AM', customer: 'John Doe', phone: '555-123-4567', email: 'john@example.com', services: 'Oil Change', finished: false },
      { time: '10:00 AM', customer: 'Jane Smith', phone: '555-987-6543', email: 'jane@example.com', services: 'Tire Repair', finished: false },
      { time: '11:00 AM', customer: 'Robert Johnson', phone: '555-222-3333', email: 'robert@example.com', services: 'Inspection', finished: false }
    ]
  };

  function getDaysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  function renderCalendar(): void {
    calendarEl.innerHTML = '';
    monthTitle.textContent = months[currentMonthIndex] + ' ' + currentYear;

    const days: number = getDaysInMonth(currentMonthIndex, currentYear);

    for (let i = 1; i <= days; i++) {
      const day: HTMLDivElement = document.createElement('div');
      day.className = 'day';
      day.textContent = String(i);

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

    const appts: Appointment[] = data[dayNum] || [];

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
      <p><strong>Services:</strong> ${appt.services}</p>
      <button class="btn-finish">Finished</button>
      <button class="btn-reschedule">Reschedule</button>
    `;

    const finishBtn = detailsEl.querySelector('.btn-finish') as HTMLButtonElement;

    finishBtn.onclick = (): void => {
      data[dayNum][index].finished = !data[dayNum][index].finished;
      renderAppointments(dayNum);
      showDetails(data[dayNum][index], dayNum, index);
    };
  }

  renderCalendar();
});