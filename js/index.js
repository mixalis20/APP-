const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('tooltip');
let image = new Image();
let isDrawing = false;
let startX, startY, endX, endY;
let annotations = [];  // Array to store all manual annotations (with titles and comments)

// Handle image upload
document.getElementById('upload').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      image.src = e.target.result;
    }
    reader.readAsDataURL(file);
  }
});

// When the image is loaded
image.onload = function() {
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
};

// Handle mouse events to draw rectangles
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    endX = e.offsetX;
    endY = e.offsetY;
    drawRect(startX, startY, endX, endY);
  }
});

canvas.addEventListener('mouseup', (e) => {
  isDrawing = false;
  const title = document.getElementById('objectTitle').value || "Untitled";
  const comment = document.getElementById('objectComment').value || "No comment";
  
  annotations.push({ 
    x: startX, 
    y: startY, 
    width: endX - startX, 
    height: endY - startY, 
    title: title,
    comment: comment
  });
  console.log(annotations);
  drawAnnotations();
});

// Function to draw a rectangle
function drawRect(x, y, x2, y2) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  drawAnnotations();

  const width = x2 - x;
  const height = y2 - y;

  // Ensure we are drawing positive width and height
  if (width < 0) {
    x = x2;
  }
  if (height < 0) {
    y = y2;
  }

  ctx.beginPath();
  ctx.rect(x, y, Math.abs(width), Math.abs(height));
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'red';
  ctx.stroke();
}

// Function to draw all annotations
function drawAnnotations() {
  annotations.forEach(annotation => {
    ctx.beginPath();
    ctx.rect(annotation.x, annotation.y, annotation.width, annotation.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();

    ctx.fillStyle = 'red';
    ctx.fillText(annotation.title, annotation.x, annotation.y > 10 ? annotation.y - 5 : 10);

    ctx.fillStyle = 'blue';
    ctx.fillText("Comment: " + annotation.comment, annotation.x, annotation.y + annotation.height + 15);
  });
}

// Save image information
document.getElementById('saveImageInfoButton').addEventListener('click', function() {
  const imageData = {
    image: image.src,
    width: image.width,
    height: image.height
  };

  const blob = new Blob([JSON.stringify(imageData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'image_info.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Save annotations and objects
document.getElementById('saveAnnotationsButton').addEventListener('click', function() {
  const data = {
    manualAnnotations: annotations
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'annotations_objects.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
