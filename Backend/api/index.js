var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");



// Set up an express app
var router = express();
var imagesRouter = require('./routes/image');

// Middleware to parse JSON requests
router.use(cors());
router.use(express.json());  // Use express.json() to handle JSON request bodies

// Database connection
mongoose.connect(DBString, { useNewUrlParser: true, useUnifiedTopology: true });

var database = mongoose.connection;

database.on("error", (error) => {
    console.log(error);
});

database.once("connected", () => {
    console.log("Database connected");
});

// Use imagesRouter for routes under '/api/images'
router.use('/api/images', imagesRouter);

// Start the server
router.listen(8000, () => {
    console.log(`Server started at http://localhost:8000`);
});
