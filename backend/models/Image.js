const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: false,
        default: 'Untitled'
    },
    description: {
        type: String,
        required: false,
        default: 'No description'
    }
});

module.exports = mongoose.model('Image', imageSchema);
