const galleryItems = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
    });
});

function closeLightbox() {
    lightbox.style.display = 'none';
}

// Close lightbox on click outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('close')) {
        closeLightbox();
    }
});