const express = require('express');
const router = express.Router();
const Data = require('../models/data');

// Endpoint για ανάκτηση όλων των δεδομένων
router.get('/', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Endpoint για την προσθήκη νέων δεδομένων
router.post('/', async (req, res) => {
    const data = new Data({
        name: req.body.name,
        value: req.body.value
    });

    try {
        const newData = await data.save();
        res.status(201).json(newData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
