const uploadForm = document.getElementById('uploadForm');
const imageInput = document.getElementById('imageInput');
const annotationTitle = document.getElementById('annotationTitle');
const annotationDescription = document.getElementById('annotationDescription');
const canvas = document.getElementById('annotationCanvas');
const ctx = canvas.getContext('2d');

let imageData = null; // Store the image data

// Load the image into the canvas
imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            imageData = canvas.toDataURL('image/png');
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

// Draw annotations on the canvas
let isDrawing = false;
let startX, startY;

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            ctx.strokeStyle = 'red';
            ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
        };
        img.src = imageData;
    };
    reader.readAsDataURL(file);
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

// Submit the data
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const annotation = {
        title: annotationTitle.value,
        description: annotationDescription.value,
        x: startX,
        y: startY,
        width: canvas.width,
        height: canvas.height,
    };

    const data = {
        image: imageData,
        annotation,
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/api/images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        alert('Image and annotation saved successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save image and annotation.');
    }
});
