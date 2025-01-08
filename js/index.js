const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let image = new Image();
let isDrawing = false;
let startX = 0, startY = 0, endX = 0, endY = 0;
let annotations = [];

// Φόρτωση εικόνας στον καμβά
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

// Όταν φορτωθεί η εικόνα, την εμφανίζουμε στον καμβά
image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    drawAnnotations();
};

// Υπολογισμός θέσης του ποντικιού στο canvas
function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

// Έναρξη σχεδίασης
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pos = getMousePos(e);
    startX = pos.x;
    startY = pos.y;
});

// Κίνηση του ποντικιού για σχεδίαση του ορθογωνίου
canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        const pos = getMousePos(e);
        endX = pos.x;
        endY = pos.y;
        drawRectPreview(startX, startY, endX, endY);
    }
});

// Τέλος σχεδίασης
canvas.addEventListener('mouseup', () => {
    if (!isDrawing) return;
    isDrawing = false;

    const title = document.getElementById('objectTitle').value.trim() || "Untitled";
    const description = document.getElementById('objectComment').value.trim() || "No description";

    const newAnnotation = {
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
        title: title,
        description: description
    };
    annotations.push(newAnnotation);

    console.log('Annotations List:');
    annotations.forEach((annotation, index) => {
        console.log(`Annotation ${index + 1}: Title: ${annotation.title}, Description: ${annotation.description}`);
    });

    drawAnnotations();
});

// Προεπισκόπηση του ορθογωνίου κατά τη διάρκεια της κίνησης του ποντικιού
function drawRectPreview(x, y, x2, y2) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    drawAnnotations();

    const rectX = Math.min(x, x2);
    const rectY = Math.min(y, y2);
    const rectWidth = Math.abs(x2 - x);
    const rectHeight = Math.abs(y2 - y);

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
        ctx.strokeStyle = 'blue';
        ctx.stroke();

        ctx.fillStyle = 'blue';
        ctx.font = '12px Arial';
        ctx.fillText(annotation.title, annotation.x, annotation.y > 10 ? annotation.y - 5 : 10);

        ctx.fillStyle = 'green';
        ctx.font = '10px Arial';
        ctx.fillText(`Description: ${annotation.description}`, annotation.x, annotation.y + annotation.height + 15);
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

document.getElementById('saveButton').addEventListener('click', async function() {
    const imageFile = document.getElementById('upload').files[0];
    const objectTitle = document.getElementById('objectTitle').value;
    const objectComment = document.getElementById('objectComment').value;

    if (!imageFile) {
        alert('Please upload an image first!');
        return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', objectTitle);
    formData.append('comment', objectComment);

    try {
        const response = await fetch('http://localhost:8000/api/images/create', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Image uploaded successfully:', result);
            alert('Image uploaded successfully!');
            fetchImages(); // Επαναφορά της gallery μετά την αποθήκευση
        } else {
            alert('Failed to upload image.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error uploading image.');
    }
});

// Fetch images και εμφάνιση στη gallery
async function fetchImages() {
    try {
        const response = await fetch('http://localhost:8000/api/images');
        const images = await response.json();

        const galleryContainer = document.getElementById('gallery');
        galleryContainer.innerHTML = '';

        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image.imageUrl;
            imgElement.alt = image.title;
            galleryContainer.appendChild(imgElement);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        alert('Error fetching images');
    }
}

// Κλήση της fetchImages κατά την φόρτωση της σελίδας
window.onload = fetchImages;
