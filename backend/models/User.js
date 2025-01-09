const mongoose = require('mongoose');

// Ορισμός του σχήματος του χρήστη (schema)
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Δημιουργία του μοντέλου User
const User = mongoose.model('User', userSchema);

module.exports = User;
