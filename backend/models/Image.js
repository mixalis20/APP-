const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
  image: String, // Διαδρομή του αρχείου Image
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

module.exports = mongoose.model('Image', imageSchema);
