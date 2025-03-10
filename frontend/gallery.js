import jwt_decode from 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.esm.js';
async function fetchGallery() {
    try {
        const response = await fetch('http://localhost:5000/api/images');
        let images = await response.json();
        console.log(images);  
        images = images.filter(image => !image.deleted);
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

// Συνάρτηση για εμφάνιση φιλτραρισμένων εικόνων στην gallery
function displayFilteredGallery(images, category) {
    const galleryDiv = document.getElementById('gallery');
    galleryDiv.innerHTML = ''; // Καθαρίζει την gallery

    // Φιλτράρισμα εικόνας σύμφωνα με την κατηγορία
    const filteredImages = category === 'all' 
    ? images.filter(image => !image.deleted)  // Φιλτράρισμα με βάση το deleted
        : images.filter(image => image.category && image.category.includes(category));

    filteredImages.forEach(imageData => {
        const container = document.createElement('div');
        container.classList.add('image-container');

        // Δημιουργία εικόνας
        const img = document.createElement('img');
        img.src = imageData.image;
        img.classList.add('gallery-image');
        container.appendChild(img);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            deleteImage(imageData._id);  // Κλήση της συνάρτησης διαγραφής
        });

        // Δημιουργία κουμπιού "Λήψη"
        const downloadBtn = document.createElement('button');
        downloadBtn.innerText = 'Download';
        downloadBtn.classList.add('download-btn');
        downloadBtn.addEventListener('click', () => downloadImage(imageData.image));

        // Προσθήκη του κουμπιού διαγραφής στο container
        container.appendChild(deleteButton);
        container.appendChild(downloadBtn);

        // Προσθήκη της εικόνας στο div της gallery
        galleryDiv.appendChild(container);

        // Όταν κάνεις κλικ στην εικόνα, ανοίγει το modal
        img.addEventListener('click', () => {
            openImageModal(imageData);
        });
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

     // Βάζουμε το μέγεθος που δηλώθηκε στο resize
     if (imageData.width && imageData.height) {
        modalImage.style.width = `${imageData.width}px`;
        modalImage.style.height = `${imageData.height}px`;
    } else {
        modalImage.style.width = 'auto';
        modalImage.style.height = 'auto';
    }

    modalImage.src = imageData.image;
    modal.style.display = 'block';

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
        const editImage = document.createElement('img');
        editImage.src = '/frontend/images/edit.png';  // Εδώ βάζεις την διαδρομή της εικόνας που θέλεις να εμφανίζεται στο κουμπί
        editImage.style.width = '24px';  // Μπορείς να προσαρμόσεις το μέγεθος της εικόνας αν χρειάζεται
        editButton.appendChild(editImage);


        // Διασφαλίζουμε ότι το κουμπί δεν έχει background
        editButton.style.background = 'none';
        editButton.style.border = 'none';
        editButton.style.padding = '0';  // Αφαιρούμε οποιοδήποτε padding υπάρχει
        editButton.style.margin = '0';   // Αφαιρούμε margin αν υπάρχει


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






if (typeof jwt_decode === 'undefined') {
    console.error('Η βιβλιοθήκη jwt_decode δεν έχει φορτωθεί.');
} else {
    console.log('Η βιβλιοθήκη jwt_decode έχει φορτωθεί επιτυχώς.');
}
// Ο έλεγχος θα γίνεται κάθε 5 λεπτά (300,000 χιλιοστά του δευτερολέπτου)
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


async function deleteImage(imageId) {
    console.log("Trying to delete image with ID:", imageId); // Debugging

    if (!confirm('Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτή την εικόνα;')) return;

    try {
        const response = await fetch(`http://localhost:5000/api/images/${imageId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('Η εικόνα διαγράφηκε επιτυχώς!', 'success');
            fetchGallery(); // Επαναφόρτωση της gallery μετά τη διαγραφή
        } else {
            console.error('Σφάλμα κατά τη διαγραφή της εικόνας');
            showMessage('Σφάλμα κατά τη διαγραφή της εικόνας.', 'error');
        }
    } catch (error) {
        console.error('Σφάλμα:', error);
        showMessage('Αποτυχία σύνδεσης με τον server.', 'warning');
    }
}

function downloadImage(imageUrl) {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'image.jpg';  // Ο χρήστης θα κατεβάσει την εικόνα ως "image.jpg"
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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


    
  
  

