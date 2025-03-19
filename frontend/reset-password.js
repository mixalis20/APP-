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
    }, 6000);
}




document.addEventListener("DOMContentLoaded", () => {
    const passwordSection = document.getElementById("password-section");
    let currentUser = "";

    window.checkUser = async function() {
        const username = document.getElementById("username").value;
        
        try {
            const response = await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username })
            });
            
            const data = await response.json();
            if (data.exists) {
                currentUser = username;
                passwordSection.classList.remove("hidden");
                
                showMessage('Ο Χρήστης βρεθηκε με επιτυχλια!. Μπορειτε να αλλαξετε κωδικο!', 'success');
            } else {
                showMessage('Ο Χρήστης δεν βρέθηκε.', 'error');
            }
        } catch (error) {
            console.error("Error checking user:", error);
            showMessage('Αποτυχία σύνδεσης με τον server.', 'warning');
        }
    };
});

document.addEventListener("DOMContentLoaded", () => {
    const passwordSection = document.getElementById("password-section");
    let currentUser = "";

    window.checkUser = async function() {
        const username = document.getElementById("username").value;

        try {
            const response = await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username })
            });

            const data = await response.json();

            if (data.exists) {
                currentUser = username;
                passwordSection.classList.remove("hidden");
                showMessage('Ο Χρήστης βρεθηκε με επιτυχλια!. Μπορειτε να αλλαξετε κωδικο!', 'success');
            } else {
                showMessage('Ο Χρήστης δεν βρέθηκε!.', 'error');
            }
        } catch (error) {
            console.error("Error checking user:", error);
            showMessage('Αποτυχία σύνδεσης με τον server.', 'warning');
        }
    };

    window.resetPassword = async function() {
        const newPassword = document.getElementById("new-password").value;
        
        if (newPassword.length < 6) {
            showMessage('Προσοχη ο κωδικος πρεπει να εχει 6 χαρακτηρες!!', 'warning');
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: currentUser, newPassword })
            });

            const data = await response.json();

            if (data.success) {
                passwordSection.classList.add("hidden");
                window.location.href = "login.html";
            } else {
                showMessage('Σφαλμα κατα την αλλαγη κωδικου!', 'error');
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            showMessage('Αποτυχία σύνδεσης με τον server.', 'warning');
        }
    };
});

