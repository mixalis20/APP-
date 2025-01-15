const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Φόρτωση μεταβλητών περιβάλλοντος

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Λήψη διακριτικού από την κεφαλίδα Authorazation

  if (!token) {
    return res.status(401).json({ message: 'Token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded; // Αποθήκευση των πληροφοριών χρήστη στο αντικείμενο αιτήματος
    next(); // Μεταβίβαση του ελέγχου στον επόμενο ενδιάμεσο λογισμικό ή χειριστή διαδρομής
  });
};

module.exports = authenticate;
