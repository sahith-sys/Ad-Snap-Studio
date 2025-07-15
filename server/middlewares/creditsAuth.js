const jwt = require("jsonwebtoken");

const creditsAuth = (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return res.json({ success: false, message: "Invalid token" });
    }
    else{
        req.userId = decoded.id;
    }
    next();
  } catch (error) {
    console.log("Error in creditsAuth middleware:", error);
    return res.json({ success: false, message: error.message });
  }
};
module.exports = creditsAuth;
