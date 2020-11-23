require("dotenv").config();

const jwt = require("jsonwebtoken");

function jwtGen(user_id) {
  const payload = {
    user: {
      id: user_id
    }
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24hrs" });
}

module.exports = jwtGen;