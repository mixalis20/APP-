const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

const DATA_FILE = './users.json';  // Path to save images and annotations

// Mock data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Route to save image and annotations
app.post('/api/images', (req, res) => {
    const { image, annotations } = req.body;

    // Read existing data
    const currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    // Add new image with annotations
    currentData.push({ image, annotations });

    // Save to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(currentData));

    res.status(200).json({ message: 'Image and annotations saved successfully!' });
});

// Route to get all images and annotations
app.get('/api/images', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
