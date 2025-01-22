const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    image: { type: String, required: true },  // required: true, όχι True
    annotations: [
        {
            title: { type: String },
            description: { type: String }
        }
    ],
    tags: [{ type: String }],
    category: {
      type: [String], // Πίνακας από strings
      required: false, // Δεν είναι υποχρεωτικό να έχει κατηγορία
  },// Εδώ χρησιμοποιούμε πίνακα με τύπο String
});

module.exports = mongoose.model('Image', imageSchema);
