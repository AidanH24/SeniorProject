const monthSelect = document.getElementById('monthSelect') as HTMLSelectElement;
const daySelect = document.getElementById('daySelect') as HTMLSelectElement;
const timeSelect = document.getElementById('timeSelect') as HTMLSelectElement;
const summary = document.getElementById('summary') as HTMLDivElement;

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
            if (hour === endHour && minute > 45) continue;
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
async function loadAvailableTimes(selectedDate: string) {
    const res = await fetch(`/api/appointments/taken-times?date=${selectedDate}`);
    const data = await res.json();
    const taken = data.takenTimes;

    const allTimes = [
        "8:00 AM","8:15 AM","8:30 AM","8:45 AM",
        "9:00 AM","9:15 AM","9:30 AM","9:45 AM",
        "10:00 AM","10:15 AM","10:30 AM","10:45 AM",
        "11:00 AM","11:15 AM","11:30 AM","11:45 AM",
        "12:00 PM","12:15 PM","12:30 PM","12:45 PM",
        "1:00 PM","1:15 PM","1:30 PM","1:45 PM",
        "2:00 PM","2:15 PM","2:30 PM","2:45 PM",
        "3:00 PM","3:15 PM","3:30 PM","3:45 PM",
        "4:00 PM"
    ];

    const available = allTimes.filter(t => !taken.includes(t));

    const select = document.getElementById("timeSelect") as HTMLSelectElement;
    select.innerHTML = "";

    available.forEach(time => {
        const opt = document.createElement("option");
        opt.value = time;
        opt.textContent = time;
        select.appendChild(opt);
    });
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
function initSelectWhenPage() {
    populateMonths();
    createTimeOptions();

    monthSelect.addEventListener('change', () => {
        updateDaysForMonth();
    });

    daySelect.addEventListener('change', () => {
        const month = monthSelect.selectedIndex + 1;
        const day = daySelect.value.padStart(2, "0");
        const year = new Date().getFullYear();

        const dateStr = `${year}-${String(month).padStart(2, "0")}-${day}`;
        loadAvailableTimes(dateStr);
    });
}


const confirmBtn = document.getElementById('confirmBtn') as HTMLButtonElement;
confirmBtn.addEventListener('click', (e) => {
    e.preventDefault();
    saveDateTimeToSessionStorage();
    // Navigate to confirmation page (update the path as needed)
    window.location.href = '/confirmationPage.html';
});
const backBtn = document.getElementById('backBtn') as HTMLButtonElement;
backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Navigate back to services page (update the path as needed)
    window.location.href = '/servicesPage.html';
});

initSelectWhenPage();
