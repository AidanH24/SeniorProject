// script.ts
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('aboutForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Collect form data
            const firstName = (document.getElementById('firstName') as HTMLInputElement).value;
            const lastName = (document.getElementById('lastName') as HTMLInputElement).value;
            const phone = (document.getElementById('phone') as HTMLInputElement).value;
            const email = (document.getElementById('email') as HTMLInputElement).value;

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
            window.location.href = '/CustomerSide/ConfirmationPage/confirmationPage.html';
        });
    }
});