document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Αποτρέπει την υποβολή της φόρμας

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Εδώ μπορείς να προσθέσεις τον έλεγχο για τη βάση δεδομένων (MongoDB ή άλλο backend)
    if (email === 'user@example.com' && password === 'password123') {
        // Αν τα στοιχεία είναι σωστά, αποθηκεύουμε την κατάσταση του χρήστη στο localStorage
        localStorage.setItem('loggedIn', 'true');
        // Ανακατευθύνουμε στην index.html
        window.location.href = 'index.html';
    } else {
        alert('Invalid credentials');
    }
});