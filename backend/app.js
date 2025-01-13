const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Database setup
mongoose.connect('mongodb://127.0.0.1:27017/myproject', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB:', err);
});

// Image schema
const imageSchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    annotations: { type: Array, default: [] }
});

const Image = mongoose.model('Image', imageSchema);

// Multer setup for image uploading
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to parse JSON
app.use(express.json());

// API endpoint to save image and annotations
app.post('/api/images/create', upload.single('image'), async (req, res) => {
    const { title, description, annotations } = req.body;
    const image = req.file.buffer.toString('base64'); // Convert the image to base64 format

    const newImage = new Image({
        image: `data:image/jpeg;base64,${image}`,
        title: title || 'Untitled',
        description: description || 'No description',
        annotations: JSON.parse(annotations) || []
    });

    try {
        await newImage.save();
        res.status(200).json({ message: 'Image uploaded successfully!', data: newImage });
    } catch (error) {
        res.status(500).json({ error: 'Error saving image with annotations', details: error });
    }
});

// API endpoint to get all images
app.get('/api/images', async (req, res) => {
    try {
        const images = await Image.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching images', details: error });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
