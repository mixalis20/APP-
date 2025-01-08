router.post("/create", upload.single("image"), async (req, res) => {
    console.log(req.body);  // Ελέγξτε τα δεδομένα από το frontend
    console.log(req.file);   // Ελέγξτε το αρχείο εικόνας

    if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
    }

    const requiredFields = ["title", "type", "datetime", "inspector", "category", "criticality"];
    for (let field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` });
        }
    }

    const image = new Image({
        title: req.body.title,
        type: req.body.type,
        value: req.file.path, // Διαδρομή του αρχείου εικόνας στον server
        datetime: req.body.datetime,
        inspector: req.body.inspector,
        category: req.body.category,
        criticality: req.body.criticality,
        tags: req.body.tags || [],
    });

    try {
        const newImage = await image.save();
        res.status(201).json(newImage);  // Επιστρέφει την εικόνα μετά την αποθήκευση
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
