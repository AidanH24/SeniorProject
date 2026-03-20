// script.ts
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
            // Store temporarily in localStorage
            var formData = {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email
            };
            localStorage.setItem('formData', JSON.stringify(formData));
            // Navigate to confirmation page
            window.location.href = 'confirmationPage.html';
        });
    }
});
