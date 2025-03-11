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
      required: false,},
      deleted: { type: Boolean, default: false } // Προσθήκη select: false
  
});

module.exports = mongoose.model('Image', imageSchema);
