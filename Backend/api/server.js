const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const Image = require('./models/image'); // Αφορά το μοντέλο για τις εικόνες

dotenv.config();

const app = express();
const port = 8000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Εξυπηρετεί εικόνες από το φάκελο uploads

// Σύνδεση με τη βάση δεδομένων MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Multer storage configuration για τις εικόνες
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Ορίζει το όνομα του αρχείου
    }
});

const upload = multer({ storage: storage });

// Διαδρομή για την αποθήκευση εικόνας και annotation
app.post('/api/uploads/create', upload.single('image'), async (req, res) => {
    const { title, comment } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
    }

    try {
        const newImage = new Image({
            title: title,
            comment: comment,
            imagePath: req.file.path // Αποθηκεύει την διαδρομή της εικόνας
        });

        await newImage.save();
        res.status(201).json({ message: 'Image uploaded successfully', newImage });
    } catch (error) {
        console.error("Error saving image:", error);
        res.status(500).json({ message: 'Error saving image' });
    }
});

// Διαδρομή για την ανάκτηση όλων των εικόνων
app.get('/api/images', async (req, res) => {
    try {
        const images = await Image.find();
        const imagePaths = images.map(image => ({
            title: image.title,
            comment: image.comment,
            imageUrl: `http://localhost:8000/${image.imagePath.split('uploads/')[1]}`  // Δημιουργία σωστής URL για την εικόνα
        }));
        res.json(imagePaths);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Error fetching images' });
    }
});

// Εκκίνηση του server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
