// Εικονική βάση χρηστών για την επίδειξη
const users = [
    { email: 'user@example.com', password: 'password1' },
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
        // Αποθηκεύουμε την κατάσταση του χρήστη στο sessionStorage
        sessionStorage.setItem('loggedIn', true);
        sessionStorage.setItem('email', email);

        // Ανακατεύθυνση στην αρχική σελίδα ή άλλη προστατευμένη σελίδα
        window.location.href = 'index.html';  // Μπορείς να το αλλάξεις και σε gallery.html αν χρειάζεται
    } else {
        // Αν δεν βρούμε τον χρήστη, εμφανίζουμε το μήνυμα σφάλματος
        document.getElementById('error-message').style.display = 'block';
        // Καθαρίζουμε τα πεδία της φόρμας για να μην παραμείνουν τα δεδομένα
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
    }
});
