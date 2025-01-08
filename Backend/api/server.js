var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");  // Εισαγωγή του cors
require("dotenv").config();

var DBString = process.env.DATABASE_URL;  // Σύνδεση με τη βάση δεδομένων

var router = express();
var imagesRouter = require('./routes/image');

// Χρησιμοποιούμε το middleware cors για να επιτρέψουμε τα CORS αιτήματα
router.use(cors());  // Αυτό επιτρέπει όλα τα origins (π.χ., το frontend στον browser)

// Middleware για να παραλάβει JSON δεδομένα
router.use(express.json());

// Σύνδεση με τη βάση δεδομένων
mongoose.connect(DBString, { useNewUrlParser: true, useUnifiedTopology: true });
var database = mongoose.connection;

database.on("error", (error) => {
    console.log(error);
});

database.once("connected", () => {
    console.log("Database connected");
});

// Χρήση των routes για εικόνες
router.use('api/images', imagesRouter);

// Εκκίνηση του server
router.listen(8000, () => {
    console.log(`Server started at http://localhost:8000`);
});
