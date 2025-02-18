const mongoose = require('mongoose');

const deleteSchema = new mongoose.Schema({
    name: { type: String, required: true },  
    path: { type: String, required: true }, 
    deletedAt: { type: Date, default: null }, 
  }, { timestamps: true });

const SoftDelete = mongoose.model('SoftDelete', deleteSchema);

module.exports = SoftDelete;