document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Αποτρέπει την υποβολή της φόρμας

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Ελέγχουμε αν τα πεδία έχουν τιμές πριν στείλουμε το αίτημα
        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }

        const response = await fetch('http://localhost:5000/api/auth/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }), // Στέλνουμε το username και τον password στον server
        });

        // Ελέγχουμε τον status code της απόκρισης
        console.log('Response Status:', response.status); // Θα μας δείξει τον status code

        // Αν η απόκριση δεν είναι OK, χειριζόμαστε το σφάλμα ανάλογα
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData); // Εμφανίζουμε το σφάλμα στον κονσόλα
            alert(errorData.error || 'Invalid credentials. Please try again.'); // Εμφανίζουμε το σφάλμα στον χρήστη
            return;
        }

        // Αν η σύνδεση είναι επιτυχής, αποθηκεύουμε το token και ανακατευθυνόμαστε
        const data = await response.json();
        console.log('Login successful, received data:', data); // Δες τι επιστρέφει ο server

        if (data.token) {
            localStorage.setItem('token', data.token); // Αποθηκεύουμε το JWT token
            window.location.href = 'index.html'; // Ανακατεύθυνση στο index.html
        } else {
            alert('No token received. Login failed.');
        }
    } catch (error) {
        console.error('There was an error during the login request:', error);
        alert('An error occurred. Please try again later.');
    }
});
