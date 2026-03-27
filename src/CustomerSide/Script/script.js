"use strict";
// script.ts
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('aboutForm');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            // Collect form data
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const phone = document.getElementById('phone').value;
            const emailInput = document.getElementById('email');
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
           // relative (from CustomerInfoPage to VehicleInfoPage)
            window.location.href = '../VehicleInfoPage/vehicleInfoPage.html';

        });
    }
    const vehicleInfoForm = document.getElementById('vehicleInfoForm');
    if (vehicleInfoForm) {
        vehicleInfoForm.addEventListener('submit', (event) => {
            event.preventDefault();
            // Collect form data
            const make = document.getElementById('make').value;
            const type = document.getElementById('type').value;
            const color = document.getElementById('color').value;
            const year = document.getElementById('Year').value;
            // Store temporarily in sessionStorage
            const vehicleData = {
                make,
                type,
                color,
                year
            };
            sessionStorage.setItem('vehicleData', JSON.stringify(vehicleData));
            // Navigate to confirmation page
            window.location.href = '../servicesPage/servicesPage.html';
        });
    }
    const servicesForm = document.getElementById('servicesForm');
    if (servicesForm) {
        servicesForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const checkboxes = document.querySelectorAll('input[name="services"]:checked');
            const selectedServices = Array.from(checkboxes).map(cb => cb.value);
            sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices));
            window.location.href = '../ConfirmationPage/confirmationPage.html';
        });
    }
    const selectWhenForm = document.getElementById('selectWhenForm');
    if (selectWhenForm) {
        selectWhenForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const selectedMonth = document.getElementById('monthSelect').value;
            const selectedDay = document.getElementById('daySelect').value;
            const selectedTime = document.getElementById('timeSelect').value;
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
            window.location.href = '../ConfirmationPage/confirmationPage.html';
        });
    }
    const phoneInput = document.getElementById('phone');
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
