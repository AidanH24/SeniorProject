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

            // Store temporarily in localStorage
            const formData = {
                firstName,
                lastName,
                phone,
                email
            };
            localStorage.setItem('formData', JSON.stringify(formData));

            // Navigate to confirmation page
            window.location.href = 'confirmationPage.html';
        });
    }
});