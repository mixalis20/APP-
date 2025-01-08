const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        let image = new Image();
        let isDrawing = false;
        let startX = 0, startY = 0, endX = 0, endY = 0;

        // Αποθήκευση των annotations (ορθογώνια) με τίτλο και περιγραφή
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
            drawAnnotations(); // Σχεδιάζουμε τα annotations αν υπάρχουν
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

            // Λήψη τίτλου και περιγραφής από τα αντίστοιχα πεδία εισαγωγής
            const title = document.getElementById('objectTitle').value.trim() || "Untitled";
            const description = document.getElementById('objectComment').value.trim() || "No description";

            // Αποθήκευση του νέου annotation στον πίνακα
            const newAnnotation = {
                x: Math.min(startX, endX),
                y: Math.min(startY, endY),
                width: Math.abs(endX - startX),
                height: Math.abs(endY - startY),
                title: title,
                description: description
            };
            annotations.push(newAnnotation);

            // Εκτύπωση των annotations στην κονσόλα (στο F12)
            console.log('Annotations List:');
            annotations.forEach((annotation, index) => {
                console.log(`Annotation ${index + 1}: Title: ${annotation.title}, Description: ${annotation.description}`);
            });

            drawAnnotations(); // Επανασχεδιάζουμε όλα τα annotations
        });

        // Προεπισκόπηση του ορθογωνίου κατά τη διάρκεια της κίνησης του ποντικιού
        function drawRectPreview(x, y, x2, y2) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0); // Επανασχεδίαση της εικόνας στον καμβά
            drawAnnotations(); // Επανασχεδίαση όλων των annotations

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
                // Σχεδιάζουμε το ορθογώνιο
                ctx.beginPath();
                ctx.rect(annotation.x, annotation.y, annotation.width, annotation.height);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'blue';
                ctx.stroke();

                // Σχεδίαση τίτλου
                ctx.fillStyle = 'blue';
                ctx.font = '12px Arial';
                ctx.fillText(annotation.title, annotation.x, annotation.y > 10 ? annotation.y - 5 : 10);

                // Σχεδίαση περιγραφής
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

    // Δημιουργία FormData για να στείλεις την εικόνα και τα άλλα δεδομένα
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', objectTitle);
    formData.append('comment', objectComment);

    try {
        // Επιστροφή της εικόνας στο backend
        const response = await fetch('http://localhost:8000/api/images/create', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Image uploaded successfully:', result);
            alert('Image uploaded successfully!');
        } else {
            alert('Failed to upload image.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error uploading image.');
    }
});



async function fetchImages() {
    try {
        const response = await fetch('http://localhost:8000/api/images');
        const images = await response.json();

        const galleryContainer = document.getElementById('gallery');
        galleryContainer.innerHTML = ''; // Καθαρίζει την τρέχουσα gallery

        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image.value;  // Η τιμή της εικόνας είναι σε base64
            galleryContainer.appendChild(imgElement);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        alert('Error fetching images');
    }
}

window.onload = fetchImages;
