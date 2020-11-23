require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.header("token");

  if (!token) {
    return res.status(403).json({ error: "User not authorized" });
  }
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = payload.user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error: "User not authorized" });
  }
};