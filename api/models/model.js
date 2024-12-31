const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,  // Date type for datetime
        required: true
    },
    inspector: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    criticality: {
        type: String,
        required: true
    },
    tags: {
        type: [{
            id: { type: Number },
            name: { type: String }
        }],  // Array of objects with id and name
        required: false,
        default: []  // Default to empty array if no tags are provided
    }
});

module.exports = mongoose.model('Image', imageSchema);
