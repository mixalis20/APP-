const selectImage = document.querySelector('.select-image');
const inputFile = document.querySelector('#file');
const imgArea = document.querySelector('.img-area');



selectImage.addEventListener('click', function(){
    inputFile.click()
})

function updateImage(event){
    console.log("Updated")
}

inputFile.addEventListener("change",function(event){
    console.log("updated",event.target.value)

    const file = event.target.files[0];
    const reader = new FileReader();
    if (file && file instanceof Blob){
   
    reader.onload = function(e) {
        const dataUrl = e.target.result; 
        console.log(dataUrl);
    };
} 
    if (file instanceof Blob) {
    reader.readAsDataURL(file);
} 
})



