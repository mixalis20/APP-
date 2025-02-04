document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Αποτρέπει την υποβολή της φόρμας

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Ελέγχουμε αν τα πεδία έχουν τιμές πριν στείλουμε το αίτημα
    if (!username || !password) {
        showAlert('Please enter both username and password.');
        return;
    }

    try {
        const response = await submitLogin(username, password);

        if (!response.ok) {
    let errorMessage = 'Invalid credentials. Please try again.'; // Προεπιλεγμένο μήνυμα

    try {
        const errorData = await response.json();
        console.error('Error Response:', errorData);

        // Αν υπάρχει message ή error στο JSON, χρησιμοποίησέ το
        if (errorData.message) errorMessage = errorData.message;
        else if (errorData.error) errorMessage = errorData.error;
    } catch (err) {
        console.error('Error parsing JSON response:', err);
    }

    showAlert(errorMessage);
    return;
}

        
 else {
            showAlert('No token received. Login failed.');
        }

    } catch (error) {
        console.error('There was an error during the login request:', error);
        showAlert('An error occurred. Please try again later.');
    }
});

// Λειτουργία για την αποστολή της φόρμας στο backend
async function submitLogin(username, password) {
    return fetch('http://localhost:5000/api/auth/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
}

// Λειτουργία για να δείξουμε το alert
function showAlert(message) {
    alert(message);
}

// Λειτουργία για να αποθηκεύσουμε το token
function storeToken(token) {
    localStorage.setItem('token', token); // Μπορείς να το βελτιώσεις με HttpOnly cookie αν το επιθυμείς
}

// Λειτουργία για να ανακατευθυνθούμε στην αρχική σελίδα
function redirectToHomePage() {
    window.location.href = 'index.html';
}
