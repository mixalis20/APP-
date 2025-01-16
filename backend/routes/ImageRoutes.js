const express = require('express');
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/authMiddleware'); // Εισαγωγή ενδιάμεσου λογισμικού ελέγχου ταυτότητας

// Ρύθμιση του multer για τη μεταφόρτωση εικόνων
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Φάκελος για αποθήκευση εικόνων
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Δημιουργήστε μοναδικό όνομα αρχείου
  }
});

const upload = multer({ storage });

// Αρχικοποιήστε το δρομολογητή
const router = express.Router();

// Διαδρομή μεταφόρτωσης εικόνας (προστατεύεται από έλεγχο ταυτότητας JWT)
router.post('/images', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { annotations } = req.body;
    const imagePath = req.file.path; // Λάβετε τη διαδρομή αρχείου της μεταφορτωμένης εικόνας

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

// Λήψη όλων των εικόνων (προστατεύεται με έλεγχο ταυτότητας JWT)
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
