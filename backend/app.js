const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs'); // Χρήση bcryptjs αντί για bcrypt


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




// Endpoint για δημιουργία χρήστη
// ΔΕΝ χρειάζεται πλέον το bcryptjs
// const bcrypt = require('bcryptjs'); 

app.post('/users', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Λήφθηκαν δεδομένα:", username, password); // Debugging

    // Έλεγχος αν ο χρήστης υπάρχει ήδη
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Το όνομα χρήστη υπάρχει ήδη." });
    }

    // Δημιουργία χρήστη (χωρίς κρυπτογράφηση)
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "Ο χρήστης δημιουργήθηκε επιτυχώς!" });
  } catch (err) {
    console.error("❌ Σφάλμα στον server:", err);
    res.status(500).json({ error: "Σφάλμα στον διακομιστή." });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking user:", err);
    res.status(500).json({ error: "Server error." });
  }
});


app.post('/api/reset-password', async (req, res) => {
  const { username, newPassword } = req.body;

  try {
      const user = await User.findOne({ username });

      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.password = newPassword; // 🚨 Καλύτερα να χρησιμοποιηθεί bcrypt για ασφάλεια!
      await user.save();

      res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/users', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Αναζητούμε τον χρήστη στη βάση δεδομένων
    const user = await User.findOne({ username });
    console.log('Found user:', user); // Εκτυπώνουμε το αποτέλεσμα της αναζήτησης

    if (!user) {
      return res.status(404).json({ error: 'Ο χρήστης δεν βρέθηκε. Παρακαλώ ελέγξτε τα στοιχεία σας.' });
    }

    // Έλεγχος του κωδικού (χωρίς bcrypt.compare)
    if (password !== user.password) {
      return res.status(401).json({ error: 'Λάθος κωδικός πρόσβασης. Παρακαλώ δοκιμάστε ξανά.' });
    }

    // Δημιουργούμε το JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Η σύνδεση ήταν επιτυχής!', token });
  } catch (error) {
    console.error('Σφάλμα κατά τη σύνδεση:', error);
    res.status(500).json({ error: 'Παρουσιάστηκε σφάλμα στον διακομιστή. Παρακαλώ δοκιμάστε ξανά αργότερα.' });
  }
});

/**
 * Διαδρομές Εικόνων
 */

// Αποθήκευση εικόνας
app.post('/api/images', async (req, res) => {
  try {
    const { image, annotations, tags, category,deleted } = req.body;

    const newImage = new Image({
      image,
      annotations,
      tags,
      category,
      deleted: deleted || false,
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
      const images = await Image.find(); // Χωρίς φίλτρο!
      res.json(images);
  } catch (err) {
      res.status(500).json({ error: 'Σφάλμα φόρτωσης εικόνων' });
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

app.put('/api/images/:id', (req, res) => {
  const imageId = req.params.id;
  const { deleted } = req.body;
  
  // Ενημέρωση της εικόνας στη βάση δεδομένων
  Image.findByIdAndUpdate(imageId, { deleted }, { new: true }, (err, updatedImage) => {
      if (err) {
          return res.status(500).json({ message: 'Σφάλμα κατά την ενημέρωση της εικόνας' });
      }
      if (!updatedImage) {
          return res.status(404).json({ message: 'Η εικόνα δεν βρέθηκε' });
      }
      res.json(updatedImage);
  });
});



app.delete('/api/images/:id', async (req, res) => {
  try {
    const imageId = req.params.id;
    console.log("Soft deleting image with ID:", imageId);

    // Βεβαίωση ότι το ID είναι έγκυρο
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return res.status(400).json({ message: "Invalid ID." });
    }

    // Ενημέρωση του πεδίου deleted σε true
    const result = await Image.findByIdAndUpdate(
      imageId,
      { $set: { deleted: true } },
      { new: true, runValidators: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Image not found." });
    }

    return res.status(200).json({
      message: "Image soft deleted successfully.",
      imageId: result._id, // Στέλνει πίσω το αναγνωριστικό εικόνας στην απάντηση
      deletedImage: result // Επιστρέφει το ενημερωμένο αντικείμενο εικόνας
    });

  } catch (error) {
    console.error("Error during image soft deletion:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});




// Εκκίνηση του server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
