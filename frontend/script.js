import jwt_decode from 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.esm.js';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let image = new Image();
let annotations = [];
let isDrawing = false;
let startX, startY, endX, endY;
let currentAnnotation = null;


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




document.getElementById('upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

image.onload = () => {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
};

// Canvas drawing logic for annotations
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    endX = e.clientX - rect.left;
    endY = e.clientY - rect.top;
    ctx.drawImage(image, 0, 0);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;

    // Δημιουργία του annotation
    const annotation = {
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
        title: document.getElementById('titleInput').value || 'Enter annotation title...',
        description: document.getElementById('descriptionInput').value || 'Enter annotation description...',
    };

    // Προσθήκη του annotation στη λίστα
    annotations.push(annotation);

    // Επανασχεδίαση της εικόνας και των annotations
    ctx.drawImage(image, 0, 0);
    annotations.forEach(annotation => {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height);
        ctx.font = '12px Arial';
        ctx.fillText(annotation.title, annotation.x, annotation.y - 5);
    });

    // Επαναφορά των πεδίων τίτλου και περιγραφής στα κενά
    document.getElementById('titleInput').value = ''; 
    document.getElementById('descriptionInput').value = '';
       
});
function showAnnotationBox(annotation) {
    currentAnnotation = annotation;
    document.getElementById('titleInput').value = annotation.title;
    document.getElementById('descriptionInput').value = annotation.description;
}

// Open modal to resize image
document.getElementById('resize-button').addEventListener('click', () => {
    document.getElementById('resizeModal').style.display = 'block';
});

// Close modal
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('resizeModal').style.display = 'none';
});

// Apply resize
// Apply resize and re-draw annotations
document.getElementById('applyResize').addEventListener('click', () => {
    const newWidth = parseInt(document.getElementById('newWidth').value);
    const newHeight = parseInt(document.getElementById('newHeight').value);

    if (newWidth && newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(image, 0, 0, newWidth, newHeight); // Re-draw image with new dimensions

        // Αποθηκεύουμε τις νέες διαστάσεις στην εικόνα
        image.width = newWidth;
        image.height = newHeight;

        // Re-draw annotations based on new canvas size
        annotations.forEach(annotation => {
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.strokeRect(annotation.x * (newWidth / image.width), annotation.y * (newHeight / image.height), annotation.width * (newWidth / image.width), annotation.height * (newHeight / image.height));
            ctx.font = '12px Arial';
            ctx.fillText(annotation.title, annotation.x * (newWidth / image.width), annotation.y * (newHeight / image.height) - 5);
        });

        document.getElementById('resizeModal').style.display = 'none';
    } else {
        showMessage('Παρακαλώ εισάγετε και τα δύο πεδία: Πλάτος και Ύψος.', 'error');

    }
});


// Save image and annotations
document.getElementById('saveButton').addEventListener('click', async () => {
    const imageData = canvas.toDataURL();
    const selectedCategory = document.getElementById('category').value; // Λήψη επιλεγμένης κατηγορίας

    // Έλεγχος αν η εικόνα υπάρχει και αν έχει επιλεγεί κατηγορία
    if (!imageData || imageData === '') {
        alert('Παρακαλώ επιλέξτε μια εικόνα και κατηγορία πριν αποθηκεύσετε!');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData, annotations,category: selectedCategory})
        });
        if (response.ok) {
            showMessage('Η εικόνα και οι σημειώσεις αποθηκεύτηκαν επιτυχώς!', 'success');
        } else {
            showMessage('Αποτυχία αποθήκευσης εικόνας και σημειώσεων.', 'error');

        }
    } catch (error) {
        console.error('Error saving image and annotations:', error);
    }
});

// Edit title and description of annotations
document.getElementById('titleInput').addEventListener('click', () => {
    toggleInputField('titleInput', 'annotationTitle');
});

document.getElementById('descriptionInput').addEventListener('click', () => {
    toggleInputField('descriptionInput', 'annotationDescription');
});

// Toggle between text and input fields for annotation editing
function toggleInputField(inputId, textId) {
    const input = document.getElementById(inputId);
    const text = document.getElementById(textId);

    if (text) {
        input.style.display = 'block';
        input.value = text.textContent || ''; // Αν το text είναι null ή undefined, χρησιμοποιούμε κενό string.
        text.style.display = 'none';
    }

    input.addEventListener('blur', () => {
        if (text) {
            text.textContent = input.value;
            text.style.display = 'block';
            input.style.display = 'none';
        }
    });
}




document.addEventListener('DOMContentLoaded', () => {
    // Παίρνουμε όλα τα links από το navbar
    const navLinks = document.querySelectorAll('.navbar a');

    // Λογική για την ενεργοποίηση του σωστού κουμπιού
    navLinks.forEach(link => {
        // Ελέγχουμε αν η τρέχουσα διεύθυνση URL ταιριάζει με το href του συνδέσμου
        if (window.location.href.includes(link.href)) {
            // Προσθέτουμε την κλάση active για το επιλεγμένο link
            link.classList.add('active');
        } else {
            // Αφαιρούμε την κλάση active από τα υπόλοιπα links
            link.classList.remove('active');
        }
    });
});
// Έλεγχος αν ο χρήστης είναι συνδεδεμένος
if (localStorage.getItem('loggedIn') !== 'true') {
     //Αν δεν είναι συνδεδεμένος, ανακατευθύνουμε στην σελίδα login
    window.location.href = 'login.html';
}

setInterval(() => {
  const token = localStorage.getItem('token');  // Ελέγχουμε αν υπάρχει το token
  if (token) {
      checkTokenExpiry(token);  // Ελέγχουμε αν έχει λήξει
  }
}, 30000);  // Κάθε 5 λεπτά
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

if (typeof jwt_decode === 'undefined') {
    console.error('Η βιβλιοθήκη jwt_decode δεν έχει φορτωθεί.');
} else {
    console.log('Η βιβλιοθήκη jwt_decode έχει φορτωθεί επιτυχώς.');
}

document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Ελέγχουμε αν υπάρχει ήδη αποθηκευμένη προτίμηση
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    }

    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    function enableDarkMode() {
        body.classList.add('dark-mode');
        document.querySelectorAll('.box, .container, .card, input, textarea, button,h1,canvas,body').forEach(el => {
            el.classList.add('dark-mode');
        });

        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.innerText = '☀️ Light Mode';
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        document.querySelectorAll('.box, .container, .card, input, textarea, button,h1,canvas,body').forEach(el => {
            el.classList.remove('dark-mode');
        });

        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.innerText = '🌙 Dark Mode';
    }
});

