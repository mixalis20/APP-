const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Εισαγωγή μοντέλων
const User = require('./models/User'); // Μοντέλο χρήστη
const Image = require('./models/Image'); // Μοντέλο εικόνας

dotenv.config(); // Φορτώνει τις περιβαλλοντικές μεταβλητές από το .env αρχείο

// Δημιουργία εφαρμογής Express
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Σύνδεση με MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

/**
 * Διαδρομές Εγγραφής και Σύνδεσης
 */

// Εγγραφή χρήστη
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Ελέγχουμε αν ο χρήστης υπάρχει ήδη
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Δημιουργούμε νέο χρήστη χωρίς κρυπτογράφηση του κωδικού
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/auth/users', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Αναζητούμε τον χρήστη στη βάση δεδομένων
    const user = await User.findOne({ username });
    console.log('Found user:', user); // Εκτυπώνουμε το αποτέλεσμα της αναζήτησης

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Έλεγχος του κωδικού (χωρίς bcrypt.compare)
    if (password !== user.password) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Δημιουργούμε το JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
setInterval(() => {
  const token = localStorage.getItem('token');  // Ελέγχουμε αν υπάρχει το token
  if (token) {
      checkTokenExpiry(token);  // Ελέγχουμε αν έχει λήξει
  }
}, 300000);  // Κάθε 5 λεπτά
function checkTokenExpiry(token) {
  const decodedToken = jwt_decode(token); // Αποκωδικοποιούμε το token
  const currentTime = Math.floor(Date.now() / 1000); // Τρέχων χρόνος σε δευτερόλεπτα
  if (decodedToken.exp < currentTime) {
      // Αν το token έχει λήξει
      localStorage.removeItem('token');
      localStorage.removeItem('loggedIn');
      window.location.href = 'login.html'; // Ανακατεύθυνση στην login σελίδα
  }
}
/**
 * Διαδρομές Εικόνων
 */

// Αποθήκευση εικόνας
app.post('/api/images', async (req, res) => {
  try {
    const { image, annotations, tags, category } = req.body;

    const newImage = new Image({
      image,
      annotations,
      tags,
      category,
    });

    await newImage.save();
    res.status(201).json({ message: 'Image saved successfully' });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ error: 'Failed to save image' });
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

// Προσθήκη tags σε εικόνα
app.post('/api/images/:id/tags', async (req, res) => {
  try {
    const { tags } = req.body;
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    image.tags = Array.from(new Set([...(image.tags || []), ...tags]));
    await image.save();

    res.status(200).json({ message: 'Tags added successfully', tags: image.tags });
  } catch (error) {
    console.error('Error adding tags:', error);
    res.status(500).json({ error: 'Failed to add tags' });
  }
});

// Ενημέρωση annotation
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
