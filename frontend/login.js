import jwt_decode from 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.esm.js';


function showMessage(message, type = 'info') {
    const messageBox = document.getElementById('messageBox');
    
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = 'block';
    
    // Κινούμενη εμφάνιση
    messageBox.classList.add('show');

    // Αυτόματο κλείσιμο μετά από 3 δευτερόλεπτα
    setTimeout(() => {
        messageBox.classList.remove('show'); // Απόκρυψη με animation
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 500);
    }, 3000);
}
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Αποτρέπει την υποβολή της φόρμας

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Ελέγχουμε αν τα πεδία έχουν τιμές πριν στείλουμε το αίτημα
    if (!username || !password) {
        showMessage('Παρακαλω εισαγετε Username και Password!','warnig');
        //showAlert('Please enter both username and password.');
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
        showMessage('Σφαλμα!!. Παρακαλω προσπαθηστε αργοτερα.','error');
        //showAlert('An error occurred. Please try again later.');

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
}, 3000);  // Κάθε 5 λεπτά
function checkTokenExpiry(token) {
    console.log("Token:", token);
    const decodedToken = jwt_decode(token);
    console.log("Decoded Token:", decodedToken);
    const currentTime = Math.floor(Date.now() / 1000);
    console.log("Current Time:", currentTime, "Token Expiry:", decodedToken.exp);
    if (decodedToken.exp < currentTime) {
        console.log("Token expired. Redirecting to login.");
        localStorage.removeItem('token');
        localStorage.removeItem('loggedIn');
        window.location.href = 'login.html';
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
if (typeof jwt_decode === 'undefined') {
    console.error('Η βιβλιοθήκη jwt_decode δεν έχει φορτωθεί.');
} else {
    console.log('Η βιβλιοθήκη jwt_decode έχει φορτωθεί επιτυχώς.');
}

