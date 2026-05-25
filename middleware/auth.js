const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	console.log("Hello console/.....", req.headers['authorization'])
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "टोकन गायब है, एक्सेस डिनाइड!" });
  }
  jwt.verify(token, process.env.JWT_SECRET || 'bhaichara_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "टोकन इनवैलिड या एक्सपायर हो चुका है!" }); // 👈 यही 403 आ रहा है
    }
    req.user = decoded; 
    next();
  });
};

module.exports = verifyToken;