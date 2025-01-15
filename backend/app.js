const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authroutes');
const imageRoutes = require('./routes/imageRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Σύνδεση με MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Αποθήκευση εικόνας και annotations
app.post('/api/images', async (req, res) => {
  try {
    const { image, annotations } = req.body;
    const newImage = new Image({ image, annotations });
    await newImage.save();
    res.status(201).json({ message: 'Image and annotations saved successfully' });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ error: 'Failed to save image and annotations' });
  }
});

// Ανάκτηση εικόνων και annotations
app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Χρήση διαδρομών ελέγχου ταυτότητας
app.use('/api/auth', authRoutes);
app.use('/api', imageRoutes);

// Στατικός φάκελος για την προβολή μεταφορτωμένων εικόνων
app.use('/uploads', express.static('uploads'));


// Εκκίνηση του server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
