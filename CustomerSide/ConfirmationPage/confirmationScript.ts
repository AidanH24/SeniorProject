// confirmationScript.ts
document.addEventListener('DOMContentLoaded', () => {
    // Retrieve data from sessionStorage
    const storedUserData = sessionStorage.getItem('userData'); 
    if (storedUserData) {
        const userData = JSON.parse(storedUserData);

        // Populate the user information on the confirmation page
        const nameElement = document.getElementById('name');
        if (nameElement) {
            nameElement.textContent = `Name: ${userData.firstName} ${userData.lastName}`;
        }

        const phoneElement = document.getElementById('phone');
        if (phoneElement) {
            phoneElement.textContent = `Phone: ${userData.phone}`;
        }
    }
    const storedVehicleData = sessionStorage.getItem('vehicleData');
    if (storedVehicleData) {
        const vehicleData = JSON.parse(storedVehicleData);
        // Populate vehicle information on the confirmation page
        const vehicleMakeElement = document.getElementById('vehicleMake');
        if (vehicleMakeElement) {
            vehicleMakeElement.textContent = `Vehicle Make: ${vehicleData.make}`;
        }

        const vehicleTypeElement = document.getElementById('vehicleType');
        if (vehicleTypeElement) {
            vehicleTypeElement.textContent = `Vehicle Type: ${vehicleData.type}`;
        }

        const vehicleColorElement = document.getElementById('vehicleColor');
        if (vehicleColorElement) {
            vehicleColorElement.textContent = `Vehicle Color: ${vehicleData.color}`;
        }

        const vehicleYearElement = document.getElementById('vehicleYear');
        if (vehicleYearElement) {
            vehicleYearElement.textContent = `Vehicle Year: ${vehicleData.year}`;
        }

        // Note: Other fields like vehicle, color, services, date, time are not yet collected
        // They can be added when more forms are implemented
    }
});

// Define the finish function (though not asked, it's referenced in HTML)
function finish() {
    // For now, just clear the storage and go back or something
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('vehicleData');
    alert('Form submitted successfully!');
    // Perhaps redirect to home or something, but since not specified, just alert
}