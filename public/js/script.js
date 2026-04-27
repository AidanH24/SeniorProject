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

            const firstNameInput = document.getElementById('firstName');
            if (firstNameInput) {
                firstNameInput.addEventListener('input', () => {
                    const value = firstNameInput.value.trim().toLowerCase();
                    if (value === "admin") {
                        sessionStorage.setItem("adminMode", "true");
                        window.location.href = "/GarageCalendar.html";
                    }
                });
            }

            // NORMAL CUSTOMER — allow browser validation
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Collect customer data
            const lastName = document.getElementById('lastName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();

            const userData = { firstName, lastName, phone, email };
            sessionStorage.setItem('userData', JSON.stringify(userData));

            window.location.href = '/vehicleInfoPage.html';
        });
    }

    // VEHICLE INFO PAGE
    const vehicleInfoForm = document.getElementById('vehicleInfoForm');
    if (vehicleInfoForm) {

        // Electric / Hybrid alert
        const typeSelect = document.getElementById("type");
        if (typeSelect) {
            typeSelect.addEventListener("change", function () {
                const selectedValue = this.value;
                if (selectedValue === "Electric Vehicle" || selectedValue === "Hybrid") {
                    alert("Please call for service on this vehicle type.");
                    typeSelect.value = ""; // Reset selection
                }
            });
        }

        vehicleInfoForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const make = document.getElementById('make').value;
            const type = document.getElementById('type').value;
            const color = document.getElementById('color').value;
            const year = document.getElementById('Year').value;

            const vehicleData = { make, type, color, year };
            sessionStorage.setItem('vehicleData', JSON.stringify(vehicleData));

            window.location.href = '/servicesPage.html';
        });

        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/aboutPage.html';
            });
        }
    }

    // SERVICES PAGE
    const servicesForm = document.getElementById('servicesForm');
    if (servicesForm) {
        servicesForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const checkboxes = document.querySelectorAll('input[name="services"]:checked');
            const selectedServices = Array.from(checkboxes).map(cb => cb.value);

            sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices));

            window.location.href = '/selectWhenPage.html';
        });

        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '/vehicleInfoPage.html';
            });
        }
    }

    // PHONE FORMATTER
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            let digits = phoneInput.value.replace(/\D/g, '');
            digits = digits.substring(0, 10);

            let formatted = '';
            if (digits.length > 0) formatted = digits.substring(0, 3);
            if (digits.length >= 4) formatted += '-' + digits.substring(3, 6);
            if (digits.length >= 7) formatted += '-' + digits.substring(6, 10);

            phoneInput.value = formatted;
        });
    }

});
