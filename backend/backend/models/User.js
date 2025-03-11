const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Σχήμα του χρήστη
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Το username πρέπει να είναι μοναδικό και υποχρεωτικό
  password: { type: String, required: true }, // Ο κωδικός είναι υποχρεωτικός
});

// Middleware για κρυπτογράφηση του κωδικού πριν την αποθήκευση
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Μέθοδος για επαλήθευση του κωδικού
userSchema.methods.isPasswordValid = async function (password) {
  return bcrypt.compare(password, this.password); // Επιστρέφει true αν ο κωδικός είναι σωστός
};

// Εξαγωγή του μοντέλου
module.exports = mongoose.model('User', userSchema);
