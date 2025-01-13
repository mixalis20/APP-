const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Σύνδεση με MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/myproject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Σχήμα για τις εικόνες
const imageSchema = new mongoose.Schema({
  image: String,
  annotations: [
    {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
      title: String,
      description: String,
    },
  ],
});

const Image = mongoose.model('Image', imageSchema);

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

// Εκκίνηση του server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
