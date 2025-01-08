const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comment: { type: String, required: true },
    imagePath: { type: String, required: true }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
