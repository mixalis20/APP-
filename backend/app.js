const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authroutes');
const imageRoutes = require('./routes/ImageRoutes');
const Image = require('./models/Image');
const authenticate = require('./middleware/authMiddleware'); // Εισαγωγή του middleware  

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

// Αποθήκευση εικόνας, annotations, tags και category
app.post('/api/images', async (req, res) => {
  try {
      const { image, annotations, tags, category } = req.body;  // Λήψη των πεδίων από το request body
      const newImage = new Image({ image, annotations, tags, category });  // Δημιουργία νέας εικόνας με όλα τα πεδία
      await newImage.save();  // Αποθήκευση της εικόνας στη βάση δεδομένων
      res.status(201).json({ message: 'Image, annotations, tags, and category saved successfully' });
  } catch (error) {
      console.error('Error saving image:', error);
      res.status(500).json({ error: 'Failed to save image, annotations, tags, and category' });
  }
});





// Ανάκτηση εικόνων
app.get('/api/images', async (req, res) => {
    try {
        const images = await Image.find();
        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Προσθήκη νέων tags σε μια εικόνα
app.post('/api/images/:id/tags', async (req, res) => {
    try {
        const { tags } = req.body;
        const image = await Image.findById(req.params.id);

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Προσθήκη tags χωρίς διπλότυπα
        image.tags = Array.from(new Set([...(image.tags || []), ...tags]));
        await image.save();

        res.status(200).json({ message: 'Tags added successfully', tags: image.tags });
    } catch (error) {
        console.error('Error adding tags:', error);
        res.status(500).json({ error: 'Failed to add tags' });
    }
});


app.post('/api/images', async (req, res) => {
  try {
      const { image, annotations, tags, category } = req.body;
      
      // Ελέγξτε την κατηγορία που έρχεται
      console.log('Received category:', category);  // Ελέγξτε τι λαμβάνεται

      // Διασφαλίζουμε ότι η κατηγορία είναι πίνακας από string
      const categoryArray = Array.isArray(category) ? category : [category];

      // Ελέγξτε τη μορφή της κατηγορίας
      console.log('Processed category array:', categoryArray);  // Ελέγξτε αν μετατράπηκε σωστά

      const newImage = new Image({ 
          image, 
          annotations, 
          tags, 
          category: categoryArray  // Χρησιμοποιούμε το array κατηγοριών
      });

      await newImage.save();  // Αποθήκευση της εικόνας στη βάση δεδομένων
      res.status(201).json({ message: 'Image, annotations, tags, and category saved successfully' });
  } catch (error) {
      console.error('Error saving image:', error);
      res.status(500).json({ error: 'Failed to save image, annotations, tags, and category' });
  }
});






// Ενημέρωση annotation σε εικόνα
app.put('/api/images/:id/annotations/:index', async (req, res) => {
  try {
      const { id, index } = req.params;
      const { title, description } = req.body;

      const image = await Image.findById(id);
      if (!image) {
          return res.status(404).json({ error: 'Image not found' });
      }

      if (!image.annotations[index]) {
          return res.status(404).json({ error: 'Annotation not found' });
      }

      image.annotations[index].title = title;
      image.annotations[index].description = description;

      await image.save();
      res.status(200).json({ message: 'Annotation updated successfully' });
  } catch (error) {
      console.error('Error updating annotation:', error);
      res.status(500).json({ error: 'Failed to update annotation' });
  }
});





// Εκκίνηση του server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
