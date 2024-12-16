const selectImage = document.querySelector('.select-image');
const inputFile = document.querySelector('#file');
const imgArea = document.querySelector('.img-area');

selectImage.addEventListener('click', function(){
    inputFile.click()
})

inputFile.addEventListener('click', function(event){
    const image = event.target.files[0];
    if (file && file instanceof Blob){
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result; 
            console.log(dataUrl);
        };
        reader.readAsDataURL(file);
    } 
    if (file instanceof Blob) {
        reader.readAsDataURL(file);
    } 
    
});