async function fetchImages() {
    try {
        const response = await fetch('http://localhost:8000/api/images');
        const images = await response.json();
        const galleryContainer = document.getElementById('gallery');
        galleryContainer.innerHTML = '';

        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = 'http://localhost:8000/' + image.imagePath;
            galleryContainer.appendChild(imgElement);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        alert('Error fetching images');
    }
}

window.onload = fetchImages;
