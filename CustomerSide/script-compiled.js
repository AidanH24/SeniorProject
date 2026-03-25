//script.ts
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('aboutForm');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            // Collect form data
            var firstName = document.getElementById('firstName').value;
            var lastName = document.getElementById('lastName').value;
            var phone = document.getElementById('phone').value;
            var email = document.getElementById('email').value;
            // Store temporarily in sessionStorage
            var userData = {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));
            // Navigate to confirmation page
            window.location.href = '/CustomerSide/VehicleInfoPage/vehicleInfoPage.html';
        });
    }
    var vehicleInfoForm = document.getElementById('vehicleInfoForm');
    if (vehicleInfoForm) {
        vehicleInfoForm.addEventListener('submit', function (event) {
            event.preventDefault();
            // Collect vehicle info form data
            var make = document.getElementById('make').value;
            var type = document.getElementById('type').value;
            var color = document.getElementById('color').value;
            var year = document.getElementById('Year').value;
            // Store vehicle info in sessionStorage (you can choose to store it separately or together with previous data)
            var vehicleData = {
                make: make,
                type: type,
                color: color,
                year: year
            };
            sessionStorage.setItem('vehicleData', JSON.stringify(vehicleData));
            // Navigate to next page (if there is one, otherwise you can handle it as needed)
            window.location.href = '/CustomerSide/ServicesPage/servicesPage.html';            
        });
    }
    var servicesForm = document.getElementById('servicesForm');
    if (servicesForm) {
        servicesForm.addEventListener('submit', function (event) {
            event.preventDefault();
            // Collect selected services
            var selectedServices = [];
            var serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
            serviceCheckboxes.forEach(function (checkbox) {
                selectedServices.push(checkbox.value);
            });
            // Store selected services in sessionStorage
            sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices));
            // Navigate to next page (if there is one, otherwise you can handle it as needed)
            window.location.href = '/CustomerSide/ConfirmationPage/confirmationPage.html';            
        });
    }
});
