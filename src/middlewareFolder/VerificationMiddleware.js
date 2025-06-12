// VerificationMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized access: No token provided.' });
  }
 console.log(authHeader)
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized access: Malformed token.' });
  }

  jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized access: Invalid token.' });
    }
    req.decoded = decoded;
    next();
  });
};

// ✅ Correct export
module.exports = verifyToken;
