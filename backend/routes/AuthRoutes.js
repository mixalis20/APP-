const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Το μοντέλο για τους χρήστες
const router = express.Router();


// Σύνδεση χρήστη
router.post('/users', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Βρες τον χρήστη στη βάση δεδομένων
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'User not found' }); // Επιστροφή σφάλματος αν ο χρήστης δεν υπάρχει
    }

    // Έλεγχος του κωδικού
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid password' }); // Επιστροφή σφάλματος αν ο κωδικός είναι λάθος
    }

    // Δημιουργία του JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Login successful', token }); // Επιστροφή επιτυχίας
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
}, 30000);  // Κάθε 5 λεπτά
function checkTokenExpiry(token) {
  console.log("Token:", token);
  const decodedToken = jwt_decode(token);
  console.log("Decoded Token:", decodedToken);
  const currentTime = Math.floor(Date.now() / 1000);
  console.log("Current Time:", currentTime, "Token Expiry:", decodedToken.exp);
  if (decodedToken.exp < currentTime) {
      console.log("Token expired. Redirecting to login.");
      localStorage.removeItem('token');
      localStorage.removeItem('loggedIn');
      window.location.href = 'login.html';
  }
}



// Εγγραφή χρήστη
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;
