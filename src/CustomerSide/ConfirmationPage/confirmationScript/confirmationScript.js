"use strict";
// confirmationScript.ts
document.addEventListener('DOMContentLoaded', () => {
    // Retrieve data from sessionStorage
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        // Populate the user information on the confirmation page
        const nameElement = document.getElementById('name');
        if (nameElement) {
            nameElement.textContent = `${userData.firstName} ${userData.lastName}`;
        }
        const phoneElement = document.getElementById('phone');
        if (phoneElement) {
            phoneElement.textContent = `${userData.phone}`;
        }
    }
    const storedVehicleData = sessionStorage.getItem('vehicleData');
    if (storedVehicleData) {
        const vehicleData = JSON.parse(storedVehicleData);
        // Populate vehicle information on the confirmation page
        const vehicleMakeElement = document.getElementById('vehicleMake');
        if (vehicleMakeElement) {
            vehicleMakeElement.textContent = `${vehicleData.make}`;
        }
        const vehicleTypeElement = document.getElementById('vehicleType');
        if (vehicleTypeElement) {
            vehicleTypeElement.textContent = `${vehicleData.type}`;
        }
        const vehicleColorElement = document.getElementById('vehicleColor');
        if (vehicleColorElement) {
            vehicleColorElement.textContent = `${vehicleData.color}`;
        }
        const vehicleYearElement = document.getElementById('vehicleYear');
        if (vehicleYearElement) {
            vehicleYearElement.textContent = `${vehicleData.year}`;
        }
    }
    const storedSelectedServices = sessionStorage.getItem('selectedServices');
    if (storedSelectedServices) {
        const selectedServices = JSON.parse(storedSelectedServices);
        // Populate selected services on the confirmation page
        const servicesElement = document.getElementById('services');
        if (servicesElement) {
            servicesElement.textContent = `${selectedServices.join(', ')}`;
        }
    }
});
// Define the finish function (though not asked, it's referenced in HTML)
function finish() {
    sessionStorage.removeItem('userData'); //Would be submitted to datbase when implemented, but for now just clear it
    sessionStorage.removeItem('vehicleData');
    sessionStorage.removeItem('selectedServices');
    alert('Form submitted successfully!');
}
