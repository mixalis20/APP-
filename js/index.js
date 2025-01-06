// Σύνδεση με τον καμβά και άλλα στοιχεία
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('tooltip');

let image = new Image();
let isDrawing = false;
let startX = 0, startY = 0, endX = 0, endY = 0;
let annotations = []; // Πίνακας για αποθήκευση των annotations
let scaleX = 1, scaleY = 1; // Αναλογίες για scaling

// Φόρτωση εικόνας
const uploadInput = document.getElementById('upload');
uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

image.onload = function () {
    scaleX = canvas.width / image.width;
    scaleY = canvas.height / image.height;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);
    drawAnnotations(); // Σχεδίαση annotations αν υπάρχουν
};

// Υπολογισμός συντεταγμένων ποντικιού σε σχέση με τον καμβά
function getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect(); // Θέση καμβά στη σελίδα
    return {
        x: (event.clientX - rect.left) / scaleX,
        y: (event.clientY - rect.top) / scaleY
    };
}

// Σχεδίαση ορθογωνίου με ενημερωμένες συντεταγμένες
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pos = getMousePos(canvas, e);
    startX = pos.x;
    startY = pos.y;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        const pos = getMousePos(canvas, e);
        endX = pos.x;
        endY = pos.y;
        drawRectPreview(startX, startY, endX, endY);
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (!isDrawing) return;
    isDrawing = false;

    const pos = getMousePos(canvas, e);
    endX = pos.x;
    endY = pos.y;

    const rectX = Math.min(startX, endX);
    const rectY = Math.min(startY, endY);
    const rectWidth = Math.abs(endX - startX);
    const rectHeight = Math.abs(endY - startY);

    if (rectWidth > 0 && rectHeight > 0) {
        const title = document.getElementById('objectTitle').value.trim() || "Untitled";
        const comment = document.getElementById('objectComment').value.trim() || "No comment";

        annotations.push({
            x: rectX,
            y: rectY,
            width: rectWidth,
            height: rectHeight,
            title: title,
            comment: comment
        });

        console.log('New annotation added:', {
            x: rectX,
            y: rectY,
            width: rectWidth,
            height: rectHeight,
            title: title,
            comment: comment
        });

        drawAnnotations();
    } else {
        alert('Invalid rectangle dimensions. Please try again.');
    }
});

// Προεπισκόπηση σχεδίασης ορθογωνίου
function drawRectPreview(x, y, x2, y2) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    drawAnnotations();

    // Υπολογισμός σωστών συντεταγμένων και διαστάσεων
    const rectX = Math.min(x, x2); // Μικρότερο x
    const rectY = Math.min(y, y2); // Μικρότερο y
    const rectWidth = Math.abs(x2 - x); // Απόλυτη τιμή πλάτους
    const rectHeight = Math.abs(y2 - y); // Απόλυτη τιμή ύψους

    ctx.beginPath();
    ctx.rect(rectX, rectY, rectWidth, rectHeight);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();
}

// Σχεδίαση όλων των annotations
function drawAnnotations() {
    annotations.forEach(annotation => {
        ctx.beginPath();
        ctx.rect(annotation.x, annotation.y, annotation.width, annotation.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.stroke();

        ctx.fillStyle = 'red';
        ctx.fillText(annotation.title, annotation.x, annotation.y > 10 ? annotation.y - 5 : 10);

        ctx.fillStyle = 'blue';
        ctx.fillText(`Comment: ${annotation.comment}`, annotation.x, annotation.y + annotation.height + 15);
    });
}

// Κουμπί αλλαγής μεγέθους εικόνας
const resizeButton = document.getElementById('resizeButton');
resizeButton.addEventListener('click', () => {
    if (!image.src) {
        alert('Please upload an image first!');
        return;
    }

    const newWidth = parseInt(prompt('Enter new width:', canvas.width));
    const newHeight = parseInt(prompt('Enter new height:', canvas.height));

    if (newWidth > 0 && newHeight > 0) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(image, 0, 0, newWidth, newHeight);
        drawAnnotations();
    } else {
        alert('Invalid dimensions entered.');
    }
});

// Κουμπί αποθήκευσης εικόνας
const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', () => {
    if (!image.src) {
        alert('Please upload an image first!');
        return;
    }

    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = 'annotated-image.png';
    downloadLink.click();
});
