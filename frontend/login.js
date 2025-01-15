document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Αποτρέπει την υποβολή της φόρμας για να κάνουμε πρώτα τον έλεγχο.

    // Εδώ μπορείς να προσθέσεις τον έλεγχο για το email και τον κωδικό.

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Ελέγχουμε αν τα πεδία δεν είναι κενά.
    if (email && password) {
        // Όταν τα δεδομένα είναι σωστά, ανακατευθύνουμε στο index.html.
        window.location.href = 'index.html';  // Ανακατεύθυνση στην αρχική σελίδα
    } else {
        alert('Please fill in both fields');
    }
});