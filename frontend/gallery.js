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

// Συνάρτηση για να ανοίξει το modal με την εικόνα και τις annotations
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

        // Εμφανίζουμε τον τίτλο και την περιγραφή του annotation
        const titleDiv = document.createElement('div');
        const storedTitle = localStorage.getItem(`annotation-title-${imageData.image}-${index}`) || annotation.title;
        titleDiv.innerHTML = `<strong>Τίτλος: </strong><span class="annotation-title">${storedTitle}</span>`;
        
        const descriptionDiv = document.createElement('div');
        const storedDescription = localStorage.getItem(`annotation-description-${imageData.image}-${index}`) || annotation.description;
        descriptionDiv.innerHTML = `<strong>Περιγραφή: </strong><span class="annotation-description">${storedDescription}</span>`;
        
        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');

        // Δημιουργία εικόνας για το κουμπί επεξεργασίας
        const img = document.createElement('img');
        img.src = '/frontend/images/edit.png';  // Εδώ βάλε την διαδρομή της εικόνας σου
        img.alt = 'Επεξεργασία';

        // Αφαίρεση φόντου και περιθωρίων από το κουμπί
        editButton.style.background = 'none';
        editButton.style.border = 'none';
        editButton.style.padding = '0';  // Αν θέλεις να αφαιρέσεις οποιοδήποτε padding

        // Προσθήκη της εικόνας στο κουμπί
        editButton.appendChild(img);

        // Κουμπί για να μετατρέψει τα πεδία σε input
        editButton.addEventListener('click', () => {
            // Μετατρέπουμε τον τίτλο και την περιγραφή σε πεδία επεξεργασίας
            const titleSpan = titleDiv.querySelector('.annotation-title');
            const descriptionSpan = descriptionDiv.querySelector('.annotation-description');
            
            titleDiv.innerHTML = `<strong>Τίτλος: </strong><input type="text" value="${titleSpan.textContent}">`;
            descriptionDiv.innerHTML = `<strong>Περιγραφή: </strong><textarea>${descriptionSpan.textContent}</textarea>`;
            
            // Προσθήκη κουμπιού για αποθήκευση των αλλαγών
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Αποθήκευση Αλλαγών';
            saveButton.classList.add('save-button');
            descriptionDiv.appendChild(saveButton);

            // Όταν πατηθεί το κουμπί Αποθήκευση, αποθηκεύουμε τις αλλαγές
            saveButton.addEventListener('click', () => {
                const updatedTitle = titleDiv.querySelector('input').value;
                const updatedDescription = descriptionDiv.querySelector('textarea').value;

                // Αποθήκευση των νέων τίτλων και περιγραφών στο localStorage
                localStorage.setItem(`annotation-title-${imageData.image}-${index}`, updatedTitle);
                localStorage.setItem(`annotation-description-${imageData.image}-${index}`, updatedDescription);

                // Ενημέρωση του modal με τις νέες τιμές
                openImageModal(imageData); // Ανανεώνουμε το modal με τις νέες τιμές
            });
        });

        // Προσθήκη του τίτλου, της περιγραφής και του κουμπιού επεξεργασίας
        annotationDiv.appendChild(titleDiv);
        annotationDiv.appendChild(descriptionDiv);
        annotationDiv.appendChild(editButton);

        modalAnnotations.appendChild(annotationDiv);
    });

    // Εμφανίζουμε τα tags, αν υπάρχουν, στο modal
    loadTags(imageData);

    // Προσθήκη tags στο modal
    addTagsButton.addEventListener('click', () => {
        const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        
        if (tags.length > 0) {
            // Φόρτωση των υπαρχόντων tags από το localStorage
            let existingTags = JSON.parse(localStorage.getItem(imageData.image)) || [];

            // Προσθήκη νέων tags στα υπάρχοντα tags (χωρίς διπλότυπα)
            existingTags = [...new Set([...existingTags, ...tags])];

            // Αποθήκευση των ενημερωμένων tags στον localStorage
            localStorage.setItem(imageData.image, JSON.stringify(existingTags));

            // Ενημέρωση των tags στο modal
            loadTags(imageData);

            // Καθαρισμός του πεδίου εισαγωγής
            tagsInput.value = '';
        }
    });

    // Εμφανίζουμε το modal με ομαλό fade-in effect
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.opacity = 1;
    }, 100);

    // Ορίζουμε ένα smooth fade-out effect όταν κλείνει το modal
    document.getElementById('closeModal').addEventListener('click', () => {
        modal.style.opacity = 0;
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
}

// Φόρτωση Tags στο Modal
function loadTags(imageData) {
    const imageTagsContainer = document.getElementById('imageTags');
    const tags = JSON.parse(localStorage.getItem(imageData.image)) || [];

    imageTagsContainer.innerHTML = tags.map(tag => `<span>${tag}</span>`).join(', ');
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

// Εμφάνιση της gallery όταν φορτώνει η σελίδα
fetchGallery();
