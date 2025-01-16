async function fetchGallery() {
    try {
        const response = await fetch('http://localhost:5000/api/images');
        const images = await response.json();
        const galleryDiv = document.getElementById('gallery');
        galleryDiv.innerHTML = ''; // Καθαρίζει την gallery

        images.forEach(imageData => {
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
    } catch (error) {
        console.error('Error fetching gallery:', error);
    }
}

// Λειτουργία για να ανοίξει το modal με την εικόνα και τις annotations
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
    imageData.annotations.forEach(annotation => {
        const annotationDiv = document.createElement('div');
        annotationDiv.classList.add('annotation');

        const titleLabel = document.createElement('strong');
        titleLabel.textContent = 'Τίτλος: ';
        annotationDiv.appendChild(titleLabel);

        const title = document.createElement('h3');
        title.textContent = annotation.title;
        annotationDiv.appendChild(title);

        const descriptionLabel = document.createElement('strong');
        descriptionLabel.textContent = 'Περιγραφή: ';
        annotationDiv.appendChild(descriptionLabel);

        const description = document.createElement('p');
        description.textContent = annotation.description;
        annotationDiv.appendChild(description);

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

            // Προσθήκη νέων tags στα υπάρχοντα tags
            existingTags = [...new Set([...existingTags, ...tags])]; // Χρησιμοποιούμε Set για να μην έχουμε διπλότυπα

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

// Φόρτωση των tags από το localStorage
function loadTags(imageData) {
    const imageTagsContainer = document.getElementById('imageTags');
    const tags = JSON.parse(localStorage.getItem(imageData.image)) || [];

    imageTagsContainer.innerHTML = tags.map(tag => `<span>${tag}</span>`).join('');
}

// Κλείσιμο του modal όταν κάνεις κλικ στο κουμπί κλεισίματος
document.getElementById('closeModal').addEventListener('click', () => {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
});

// Εμφάνιση της gallery όταν φορτώνει η σελίδα
fetchGallery();

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
