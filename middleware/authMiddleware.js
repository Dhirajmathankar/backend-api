const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // टोकन वेरीफाई करें
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bhaichara_secret_key');
      console.log("===================", decoded)
      // 🔥 यहाँ सुनिश्चित करें कि _id सीधे सेट हो रहा है
      req.user = {
        _id: decoded._id || decoded.id,
        email: decoded.email
      };

      return next();
    } catch (error) {
      console.error("❌ JWT Verification Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };