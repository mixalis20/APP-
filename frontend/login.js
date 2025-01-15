// Εικονική βάση χρηστών για την επίδειξη
const users = [
    { email: 'user1@example.com', password: 'password1' },
    { email: 'user2@example.com', password: 'password2' },
    { email: 'user3@example.com', password: 'password3' }
];

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Αποτρέπει την υποβολή της φόρμας για να κάνουμε πρώτα τον έλεγχο.

    // Παίρνουμε τις τιμές από τα πεδία email και password
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Ελέγχουμε αν το email και το password ταιριάζουν με κάποιο χρήστη
    const user = users.find(user => user.email === email && user.password === password);

    // Αν βρούμε τον χρήστη, προχωράμε στην ανακατεύθυνση
    if (user) {
        window.location.href = 'index.html';  // Ανακατεύθυνση στην αρχική σελίδα
    } else {
        // Αν δεν βρούμε τον χρήστη, εμφανίζουμε το μήνυμα σφάλματος
        document.getElementById('error-message').style.display = 'block';
    }
});