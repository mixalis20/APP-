var express = require("express");
var router = express.Router();
var Image = require("../models/model.js");

// Get all images
router.get("/", async (req, res) => {
    try {
        var images = await Image.find();
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get image by ID
async function getImage(req, res, next) {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        res.image = image;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// Get a single image
router.get("/:id", getImage, (req, res) => {
    res.json(res.image);
});

// Create a new image
router.post("/create", async (req, res) => {
    console.log(req.body);

    const requiredFields = ['title', 'type', 'value', 'datetime', 'inspector', 'category', 'criticality'];
    for (let field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` });
        }
    }

    const image = new Image({
        title: req.body.title,
        type: req.body.type,
        value: req.body.value,
        datetime: req.body.datetime,
        inspector: req.body.inspector,
        category: req.body.category,
        criticality: req.body.criticality,
        tags: req.body.tags || []
    });

    try {
        const newImage = await image.save();
        res.status(201).json(newImage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an image
router.put("/:id", getImage, async (req, res) => {
    if (req.body.title != null) {
        res.image.title = req.body.title;
    }
    if (req.body.type != null) {
        res.image.type = req.body.type;
    }
    if (req.body.value != null) {
        res.image.value = req.body.value;
    }
    if (req.body.datetime != null) {
        res.image.datetime = req.body.datetime;
    }
    if (req.body.inspector != null) {
        res.image.inspector = req.body.inspector;
    }
    if (req.body.category != null) {
        res.image.category = req.body.category;
    }
    if (req.body.criticality != null) {
        res.image.criticality = req.body.criticality;
    }
    if (req.body.tags != null) {
        res.image.tags = req.body.tags;
    }

    try {
        const updatedImage = await res.image.save();
        res.json(updatedImage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an image
router.delete("/:id", getImage, async (req, res) => {
    try {
        // Delete the image using the findByIdAndDelete method
        await Image.findByIdAndDelete(req.params.id);

        // Return a success message
        res.status(200).json({ message: "Image deleted" });
    } catch (err) {
        // In case of error, return a 500 status with the error message
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
