const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config(); // Φόρτωση μεταβλητών περιβάλλοντος

const router = express.Router();

// Εγγραφή χρήστη
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Ελεγχος εάν το όνομα χρήστη υπάρχει ήδη
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Κατακερματίστε τον κωδικό πρόσβασης πριν από την αποθήκευση
    const hashedPassword = await bcrypt.hash(password, 10);

    // Δημιουργία ενός νέου χρήστη
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Είσοδος χρήστη και δημιουργία JWT Token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Βρείτε τον χρήστη με το όνομά του
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Έλεγχος εάν ο κωδικός πρόσβασης είναι σωστός χρησιμοποιώντας το bcrypt.compare
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Δημιουργία JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

module.exports = router;
