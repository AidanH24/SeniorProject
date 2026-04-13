// script.ts

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('aboutForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
            const firstName = firstNameInput.value.trim();

            //  ADMIN SHORTCUT — MUST RUN FIRST
            if (firstName.toLowerCase() === "admin") {
                sessionStorage.setItem("adminMode", "true");
                window.location.href = "/protectedPages/GarageSide/GarageCalendar.html";
                return;
            }

            // Normal user flow
            const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
            const phone = (document.getElementById('phone') as HTMLInputElement).value;
            const emailInput = document.getElementById('email') as HTMLInputElement;
            const email = emailInput.value;

            if (email && !isValidEmail(email)) {
                emailInput.focus();
                alert('Please enter a valid email address.');
                return;
            }

            const userData = {
                firstName,
                lastName,
                phone,
                email
            };

            sessionStorage.setItem('userData', JSON.stringify(userData));
            window.location.href = '/vehicleInfoPage.html';
        });
    }


    const vehicleInfoForm = document.getElementById('vehicleInfoForm') as HTMLFormElement;
    if (vehicleInfoForm) {
        vehicleInfoForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Collect form data
            const make = (document.getElementById('make') as HTMLSelectElement).value;
            const type = (document.getElementById('type') as HTMLSelectElement).value;
            const color = (document.getElementById('color') as HTMLSelectElement).value;
            const year = (document.getElementById('Year') as HTMLInputElement).value;

            // Store temporarily in sessionStorage
            const vehicleData = {
                make,
                type,
                color,
                year
            };
            sessionStorage.setItem('vehicleData', JSON.stringify(vehicleData));

            // Navigate to services page
            window.location.href = '/servicesPage.html';
        });
        const backBtn = document.getElementById('backBtn') as HTMLButtonElement;
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/aboutPage.html';
        });
    }
    const servicesForm = document.getElementById('servicesForm') as HTMLFormElement | null;
    if (servicesForm) {
        servicesForm.addEventListener('submit', (event: Event) => {
            event.preventDefault();

            const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="services"]:checked');

            const selectedServices = Array.from(checkboxes).map(cb => cb.value);

            sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices));

            window.location.href = '/selectWhenPage.html';
        });
        const backBtn = document.getElementById('backBtn') as HTMLButtonElement;
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Navigate back to vehicle info page
            window.location.href = '/vehicleInfoPage.html';
        }
        );
    }
    const phoneInput = document.getElementById('phone') as HTMLInputElement;
    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            // Remove all non-digits
            let digits = phoneInput.value.replace(/\D/g, '');

            // Limit to 10 digits
            digits = digits.substring(0, 10);

            // Format with dashes
            let formatted = '';

            if (digits.length > 0) {
                formatted = digits.substring(0, 3);
            }
            if (digits.length >= 4) {
                formatted += '-' + digits.substring(3, 6);
            }
            if (digits.length >= 7) {
                formatted += '-' + digits.substring(6, 10);
            }

            phoneInput.value = formatted;
        });
        
    }
});