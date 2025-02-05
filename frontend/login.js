

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
const data = await response.json();
if (data.token) {
    storeToken(data.token); // Βελτιωμένη λειτουργία για αποθήκευση του token
    localStorage.setItem('loggedIn', 'true'); // Ένδειξη ότι είναι συνδεδεμένος 
    checkTokenExpiry(data.token);
    redirectToHomePage(); // Βελτιωμένη ανακατεύθυνση
}      
 else {
            showAlert('No token received. Login failed.');
        }

    } catch (error) {
        console.error('There was an error during the login request:', error);
        showAlert('An error occurred. Please try again later.');
    }
});



// Λειτουργία για να αποθηκεύσουμε το token
function storeToken(token) {
    localStorage.setItem('token', token); // Μπορείς να το βελτιώσεις με HttpOnly cookie αν το επιθυμείς
}


// Ο έλεγχος θα γίνεται κάθε 5 λεπτά (300,000 χιλιοστά του δευτερολέπτου)
setInterval(() => {
    const token = localStorage.getItem('token');  // Ελέγχουμε αν υπάρχει το token
    if (token) {
        checkTokenExpiry(token);  // Ελέγχουμε αν έχει λήξει
    }
}, 300000);  // Κάθε 5 λεπτά
function checkTokenExpiry(token) {
    const decodedToken = jwt_decode(token); // Αποκωδικοποιούμε το token
    const currentTime = Math.floor(Date.now() / 1000); // Τρέχων χρόνος σε δευτερόλεπτα
    if (decodedToken.exp < currentTime) {
        // Αν το token έχει λήξει
        localStorage.removeItem('token');
        localStorage.removeItem('loggedIn');
        window.location.href = 'login.html'; // Ανακατεύθυνση στην login σελίδα
    }
}



// Λειτουργία για να ανακατευθυνθούμε στην αρχική σελίδα
function redirectToHomePage() {
    window.location.href = 'index.html';
}


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