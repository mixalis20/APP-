const express = require('express');
const multer = require('multer');
const path = require('path');

//Ρύθμιση της μηχανής αποθήκευσης για multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  //Ορισμός του καταλόγου μεταφόρτωσης
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  //Πρόσθεση χρονικής σήμανσης στο όνομα του αρχείου

    }
});

const upload = multer({ storage: storage });

const app = express();
const port = 5000;

//Εξυπηρέτηση στατικών αρχείων από τον κατάλογο "uploads"
app.use('/upload', express.static('uploads'));

//Διαχείριση αιτήματος POST για μεταφόρτωση αρχείων
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.json({ message: 'File uploaded successfully', file: req.file });
});

//Εξυπηρέτηση της σελίδας HTML για τον πελάτη
app.get('/', (req, res) => {
    res.sendFile('APP-\frontend' + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:5000`);
});