document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Αποτρέπει την υποβολή της φόρμας

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }), // Στέλνουμε το username και τον password στον server
        });

        const data = await response.json();

        if (response.ok) {
            // Αν η σύνδεση είναι επιτυχής, αποθηκεύουμε το token (προαιρετικά) και ανακατευθυνόμαστε
            localStorage.setItem('token', data.token); // Αποθηκεύουμε το JWT token
            window.location.href = 'index.html'; // Ανακατεύθυνση στο index.html
        } else {
            // Αν υπάρχει σφάλμα (π.χ., χρήστης δεν βρέθηκε ή λάθος κωδικός)
            alert(data.error || 'Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('There was an error during the login request:', error);
        alert('An error occurred. Please try again later.');
    }
});
