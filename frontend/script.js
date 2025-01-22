const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let image = new Image();
let annotations = [];
let isDrawing = false;
let startX, startY, endX, endY;
let currentAnnotation = null;

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
    const annotation = {
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
        title: document.getElementById('titleInput').value || 'Enter annotation title...',
        description: document.getElementById('descriptionInput').value || 'Enter annotation description...',
    };
    

    annotations.push(annotation);
    ctx.drawImage(image, 0, 0);
    annotations.forEach(annotation => {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height);
        ctx.font = '12px Arial';
        ctx.fillText(annotation.title, annotation.x, annotation.y - 5);
    });

    // Show annotation box for editing
    showAnnotationBox(annotation);
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
        alert('Please enter both width and height.');
    }
});


// Save image and annotations
document.getElementById('saveButton').addEventListener('click', async () => {
    const imageData = canvas.toDataURL();
    const selectedCategory = document.getElementById('category').value; // Λήψη επιλεγμένης κατηγορίας
    try {
        const response = await fetch('http://localhost:5000/api/images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData, annotations,category: selectedCategory})
        });
        if (response.ok) {
            alert('Image and annotations saved successfully!');
        } else {
            alert('Failed to save image and annotations');
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
    // Αν δεν είναι συνδεδεμένος, ανακατευθύνουμε στην σελίδα login
    window.location.href = 'login.html';
}


