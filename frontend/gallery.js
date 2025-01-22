async function fetchGallery() {
    try {
        const response = await fetch('http://localhost:5000/api/images');
        const images = await response.json();
        const galleryDiv = document.getElementById('gallery');
        galleryDiv.innerHTML = ''; // Καθαρίζει την gallery

        // Φίλτρο κατηγορίας
        const categoryFilter = document.getElementById('categoryFilter');
        categoryFilter.addEventListener('change', () => {
            const selectedCategory = categoryFilter.value;
            displayFilteredGallery(images, selectedCategory);
        });

        // Αρχική εμφάνιση όλων των εικόνων
        displayFilteredGallery(images, 'all');
    } catch (error) {
        console.error('Error fetching gallery:', error);
    }
}

// Συνάρτηση για εμφάνιση φιλτραρισμένων εικόνων στην gallery
function displayFilteredGallery(images, category) {
    const galleryDiv = document.getElementById('gallery');
    galleryDiv.innerHTML = ''; // Καθαρίζει την gallery

    // Φιλτράρισμα εικόνων σύμφωνα με την κατηγορία
    const filteredImages = category === 'all' ? images : images.filter(image => image.category === category);

    filteredImages.forEach(imageData => {
        const container = document.createElement('div');
        container.classList.add('image-container');

        // Δημιουργία εικόνας
        const img = document.createElement('img');
        img.src = imageData.image;
        img.classList.add('gallery-image');
        container.appendChild(img);

        // Όταν κάνεις κλικ στην εικόνα, ανοίγει το modal
        img.addEventListener('click', () => {
            openImageModal(imageData);
        });

        galleryDiv.appendChild(container);
    });
}

// Συνάρτηση για να ανοίξει το modal με την εικόνα και τις πληροφορίες
function openImageModal(imageData) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalAnnotations = document.getElementById('modalAnnotations');
    const tagsInput = document.getElementById('tagsInput');
    const addTagsButton = document.getElementById('addTagsButton');
    const imageTagsContainer = document.getElementById('imageTags');

    // Ορίζουμε την εικόνα στο modal
    modalImage.src = imageData.image;

    // Καθαρίζουμε τις προηγούμενες annotations στο modal
    modalAnnotations.innerHTML = '';

    // Προσθήκη των annotations στον modal
    imageData.annotations.forEach((annotation, index) => {
        const annotationDiv = document.createElement('div');
        annotationDiv.classList.add('annotation');

        const titleDiv = document.createElement('div');
        const descriptionDiv = document.createElement('div');

        titleDiv.innerHTML = `<strong>Τίτλος:</strong> <span class="annotation-title">${annotation.title}</span>`;
        descriptionDiv.innerHTML = `<strong>Περιγραφή:</strong> <span class="annotation-description">${annotation.description}</span>`;

        // Δημιουργία κουμπιού επεξεργασίας
        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.textContent = 'Επεξεργασία';

        editButton.addEventListener('click', () => {
            // Μετατροπή των πεδίων σε input και textarea
            const titleSpan = titleDiv.querySelector('.annotation-title');
            const descriptionSpan = descriptionDiv.querySelector('.annotation-description');

            titleDiv.innerHTML = `<strong>Τίτλος:</strong> <input type="text" value="${titleSpan.textContent}">`;
            descriptionDiv.innerHTML = `<strong>Περιγραφή:</strong> <textarea>${descriptionSpan.textContent}</textarea>`;

            // Δημιουργία κουμπιού αποθήκευσης
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Αποθήκευση';
            saveButton.classList.add('save-button');

            saveButton.addEventListener('click', async () => {
                const updatedTitle = titleDiv.querySelector('input').value;
                const updatedDescription = descriptionDiv.querySelector('textarea').value;

                // Ενημέρωση στο backend
                try {
                    const response = await fetch(`http://localhost:5000/api/images/${imageData._id}/annotations/${index}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: updatedTitle, description: updatedDescription }),
                    });

                    if (response.ok) {
                        annotation.title = updatedTitle;
                        annotation.description = updatedDescription;

                        // Ενημέρωση του modal με τις νέες τιμές
                        openImageModal(imageData);
                    } else {
                        console.error('Error updating annotation');
                    }
                } catch (error) {
                    console.error('Error updating annotation:', error);
                }
            });

            // Προσθήκη κουμπιού αποθήκευσης
            descriptionDiv.appendChild(saveButton);
        });

        annotationDiv.appendChild(titleDiv);
        annotationDiv.appendChild(descriptionDiv);
        annotationDiv.appendChild(editButton);
        modalAnnotations.appendChild(annotationDiv);
    });

    // Εμφανίζουμε τα tags
    displayTags(imageData.tags || []);

    // Προσθήκη νέων tags
    addTagsButton.onclick = async () => {
        const newTags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

        if (newTags.length > 0) {
            try {
                const response = await fetch(`http://localhost:5000/api/images/${imageData._id}/tags`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tags: newTags }),
                });

                if (response.ok) {
                    imageData.tags = [...(imageData.tags || []), ...newTags];
                    displayTags(imageData.tags);
                    tagsInput.value = '';
                }
            } catch (error) {
                console.error('Error adding tags:', error);
            }
        }
    };

    // Εμφάνιση modal
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.opacity = 1;
    }, 100);

    document.getElementById('closeModal').onclick = () => {
        modal.style.opacity = 0;
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    };
}

function displayTags(tags) {
    const imageTagsContainer = document.getElementById('imageTags');
    const safeTags = tags || [];
    imageTagsContainer.innerHTML = safeTags.map(tag => `<span>${tag}</span>`).join(', ');
}

document.addEventListener('DOMContentLoaded', () => {
    fetchGallery();
});
