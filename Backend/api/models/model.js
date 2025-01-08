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
        type: Date,
        required: true,
        default: Date.now // Αυτόματη τρέχουσα ημερομηνία
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
        required: true,
        enum: ['Good', 'Normal', 'Moderate', 'Bad', 'Severe'], // Επιτρεπτές τιμές
        default: 'Normal' // Προεπιλεγμένη τιμή
    },
    tags: {
        type: [{
            id: { type: Number, required: true },
            name: { type: String, required: true }
        }],
        validate: {
            validator: function (value) {
                const uniqueIds = new Set(value.map(tag => tag.id));
                return uniqueIds.size === value.length; // Επιστρέφει false αν υπάρχουν διπλά ids
            },
            message: 'Tags must have unique ids.'
        },
        default: [] // Προεπιλογή κενός πίνακας
    }
});

module.exports = mongoose.model('Image', imageSchema);
