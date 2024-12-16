const selectImage = document.querySelector('.select-image');
const inputFile = document.querySelector('#file');
const imgArea = document.querySelector('.img-area');



selectImage.addEventListener('click', function(){
    inputFile.click()
})

function updateImage(event){
}

inputFile.addEventListener("change",function(event){

    const image = this.files[0];
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file && file instanceof Blob){
   
    reader.onload = function(e) {
        const imgUrl = reader.result
        const dataUrl = e.target.result; 
        const img = document.createElement('img');
        img.src = imgUrl;
        imgArea.appendChild(img);
        imgArea.classList.add('active');
    };
} 
    if (file instanceof Blob) {
    reader.readAsDataURL(file);
} 
})



