// script.ts

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('aboutForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Collect form data
            const firstName = (document.getElementById('firstName') as HTMLInputElement).value;
            const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
            const phone = (document.getElementById('phone') as HTMLInputElement).value;
            const emailInput = document.getElementById('email') as HTMLInputElement;
            const email = emailInput.value;

            if (!isValidEmail(email)) {
                emailInput.focus();
                alert('Please enter a valid email address.');
                return;
            }
            
            // Store temporarily in sessionStorage
            const userData = {
                firstName,
                lastName,
                phone,
                email
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));

            // Navigate to confirmation page
            window.location.href = '/CustomerSide/VehicleInfoPage/vehicleInfoPage.html';
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

            // Navigate to confirmation page
            window.location.href = '/CustomerSide/servicesPage/servicesPage.html';
        });
    }
    const servicesForm = document.getElementById('servicesForm') as HTMLFormElement | null;
    if (servicesForm) {
        servicesForm.addEventListener('submit', (event: Event) => {
            event.preventDefault();

            const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="services"]:checked');

            const selectedServices = Array.from(checkboxes).map(cb => cb.value);

            sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices));

            window.location.href = '/CustomerSide/selectWhenPage/selectWhenPage.html';
        });
    }
    const selectWhenForm = document.getElementById('selectWhenForm') as HTMLFormElement;
    if (selectWhenForm) {
        selectWhenForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const selectedMonth = (document.getElementById('monthSelect') as HTMLSelectElement).value;
            const selectedDay = (document.getElementById('daySelect') as HTMLSelectElement).value;
            const selectedTime = (document.getElementById('timeSelect') as HTMLSelectElement).value;
            if (!selectedTime) {
                alert('Please select a time slot from the list.');
                return;
            }
            const appointmentData = {
                month: selectedMonth,
                day: selectedDay,
                time: selectedTime
            };
            sessionStorage.setItem('appointmentData', JSON.stringify(appointmentData));
            window.location.href = '/CustomerSide/ConfirmationPage/confirmationPage.html';
        });
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