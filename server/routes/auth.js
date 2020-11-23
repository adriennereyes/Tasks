const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGen = require("../utils/jwtGen");
const authorization = require("../middleware/authorization");

router.use(express.json());

const saltRounds = 10;

// Login and Authenticate user route
router.post("/login", async (req, res) => {
  try {
    let body = req.body;
    let {username, password } = body;

    const user = await pool.query("SELECT * FROM planner.Users WHERE username = $1", [username]);

    if (user.rows.length === 0) {
      return res.status(401).json({"error": "Username or password is not valid"});
    }

    const hashedPassword = user.rows[0].password;
    const isSame = await bcrypt.compare(password, hashedPassword);

    if (isSame) {
      const token = jwtGen(user.rows[0].user_id);
      return res.status(200).json({"message": "Successfully logged in", token});
    } else {
      return res.status(401).json({"error": "Username or pasword is not valid"});
    }
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
});

// Register new user route
router.post("/register", async (req, res) => {
  try {
    //1. Destruct req.body (username,password)
    let body = req.body;
    let { username, password } = body;

    if (
      !body.hasOwnProperty("username") ||
      !body.hasOwnProperty("password") ||
      !(typeof username === "string") ||
      !(typeof password === "string") ||
      !(username.length >= 5 && username.length <= 30) ||
      !(password.length >= 8 && password.length <= 36)
    ) {
      return res.status(401).json({ "error": "One or more input fields is invalid" });
    }

    //2. Check if user already exists (if user exists then throw error)
    const user = await pool.query(
      "SELECT username FROM planner.Users WHERE username = $1",
      [username]
    );

    if (user.rows.length !== 0) {
      return res.status(401).json({ "error": "Username already exists" });
    }

    //3. Bcrypt user's password and Enter new user into database
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      "INSERT INTO planner.Users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );

    //4. Generate jwt token
    const token = jwtGen(newUser.rows[0].user_id);

    res.status(200).json({"message": "Successfully registered", token });
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
});

router.get("/verify", authorization, async (req, res) => {
  try {
    //res.json(req.user);
    res.status(200).json(true);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
})

module.exports = router;