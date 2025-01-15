const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  image: String, // Image file path
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
