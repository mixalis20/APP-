document.addEventListener("DOMContentLoaded", () => {
    const passwordSection = document.getElementById("password-section");
    const messageBox = document.getElementById("messageBox"); // Προσθήκη για εμφάνιση μηνυμάτων
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
                
                // Προβολή μηνύματος επιτυχίας
                messageBox.innerText = `User "${username}" found! You can reset the password.`;
                messageBox.style.display = "block";
                messageBox.style.color = "green";
            } else {
                alert("User not found!");
            }
        } catch (error) {
            console.error("Error checking user:", error);
            alert("Server error. Try again later.");
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
                alert("User found! You can reset the password.");
            } else {
                alert("User not found!");
            }
        } catch (error) {
            console.error("Error checking user:", error);
            alert("Server error. Try again later.");
        }
    };

    window.resetPassword = async function() {
        const newPassword = document.getElementById("new-password").value;
        
        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters long.");
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
                alert("Password updated successfully!");
                passwordSection.classList.add("hidden");
            } else {
                alert("Error updating password.");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            alert("Server error. Try again later.");
        }
    };
});

