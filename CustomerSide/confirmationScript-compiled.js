// confirmationScript.ts
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve data from localStorage
    var storedData = localStorage.getItem('formData');
    if (storedData) {
        var formData = JSON.parse(storedData);
        // Populate the confirmation page
        var nameElement = document.getElementById('name');
        if (nameElement) {
            nameElement.textContent = "Name: ".concat(formData.firstName, " ").concat(formData.lastName);
        }
        var phoneElement = document.getElementById('phone');
        if (phoneElement) {
            phoneElement.textContent = "Phone: ".concat(formData.phone);
        }
        // Note: Other fields like vehicle, color, services, date, time are not yet collected
        // They can be added when more forms are implemented
    }
});
// Define the finish function (though not asked, it's referenced in HTML)
function finish() {
    // For now, just clear the storage and go back or something
    localStorage.removeItem('formData');
    alert('Form submitted successfully!');
    // Perhaps redirect to home or something, but since not specified, just alert
}
