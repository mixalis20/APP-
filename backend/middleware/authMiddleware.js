const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Φόρτωση μεταβλητών περιβάλλοντος

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader); // Για debugging

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next(); // Μεταβίβαση στον επόμενο ενδιάμεσο λογισμικό ή χειριστή
  });
};

module.exports = authenticate;