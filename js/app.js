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
            imgArea.dataset.img = image.name
        };
    } 
    if (file instanceof Blob) {
        reader.readAsDataURL(file);
    } 
    console.log(file)
    // You can reference folder2 path like this
    const folderPath = '/uploadFolder';
    const downloadLink = document.createElement('a');
    downloadLink.href = file.dataUrl;
    downloadLink.download = file.name;
    document.body.appendChild(downloadLink);
    downloadLink.click();   
    
    console.log(folderPath);

})

const data = {
    date: new Date().toISOString(),  
};
  
  console.log(JSON.stringify(data));  





// document.getElementById('uploadForm').addEventListener('submit', function(event) {
//     event.preventDefault();
    
//     // Create a FormData object to handle file input
//     const formData = new FormData();
//     const fileInput = document.getElementById('imageUpload');
//     formData.append('image', fileInput.files[0]); // Append the file
  
//     // Send the file to the server via Fetch API
//     fetch('/upload', {
//       method: 'POST',
//       body: formData,
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (data.success) {
//         alert('Image uploaded successfully!');
//       } else {
//         alert('Image upload failed.');
//       }
//     })
//     .catch(error => {
//       console.error('Error uploading image:', error);
//       alert('Error uploading image.');
//     });
//   });
  
  



