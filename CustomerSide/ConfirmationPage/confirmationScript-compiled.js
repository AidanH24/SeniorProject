// confirmationScript.ts
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve data from sessionStorage
    var storedUserData = sessionStorage.getItem('userData');
    var storedVehicleData = sessionStorage.getItem('vehicleData');

    if (storedUserData) {
        var userData = JSON.parse(storedUserData);

        // Populate the user information on the confirmation page
        var nameElement = document.getElementById('name');
        if (nameElement) {
            nameElement.textContent = "Name: ".concat(userData.firstName, " ").concat(userData.lastName);
        }
        var phoneElement = document.getElementById('phone');
        if (phoneElement) {
            phoneElement.textContent = "Phone: ".concat(userData.phone);
        }
    }
    if (storedVehicleData) {
        var vehicleData = JSON.parse(storedVehicleData);
        // Populate vehicle information on the confirmation page
        var vehicleMakeElement = document.getElementById('vehicleMake');
        if (vehicleMakeElement) {
            vehicleMakeElement.textContent = `Vehicle Make: ${vehicleData.make}`;
        }
        var vehicleTypeElement = document.getElementById('vehicleType');
        if (vehicleTypeElement) {
            vehicleTypeElement.textContent = `Vehicle Type: ${vehicleData.type}`;
        }
        var vehicleColorElement = document.getElementById('vehicleColor');
        if (vehicleColorElement) {
            vehicleColorElement.textContent = `Vehicle Color: ${vehicleData.color}`;
        }
        var vehicleYearElement = document.getElementById('vehicleYear');
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
