// confirmationScript.ts
document.addEventListener('DOMContentLoaded', () => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem('formData');
    if (storedData) {
        const formData = JSON.parse(storedData);

        // Populate the confirmation page
        const nameElement = document.getElementById('name');
        if (nameElement) {
            nameElement.textContent = `Name: ${formData.firstName} ${formData.lastName}`;
        }

        const phoneElement = document.getElementById('phone');
        if (phoneElement) {
            phoneElement.textContent = `Phone: ${formData.phone}`;
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