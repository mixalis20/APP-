const express = require('express');
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/authMiddleware'); // Import authentication middleware

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create unique filename
  }
});

const upload = multer({ storage });

// Initialize the router
const router = express.Router();

// Image upload route (protected by JWT authentication)
router.post('/images', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { annotations } = req.body;
    const imagePath = req.file.path; // Get the file path of the uploaded image

    const newImage = new Image({
      image: imagePath,
      annotations: JSON.parse(annotations),
    });

    await newImage.save();
    res.status(201).json({ message: 'Image and annotations saved successfully', image: newImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Fetch all images (protected by JWT authentication)
router.get('/images', authenticate, async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

module.exports = router;
