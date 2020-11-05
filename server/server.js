require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./db");

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

app.use(express.json());

const validStatus = ["yes", "no"];

// ROUTES

// Create a task
app.post("/mytasks", (req, res) => {
  const body = req.body;
  const description = body.description;
  const status = body.status;

  if (
    !body.hasOwnProperty("description") ||
    !body.hasOwnProperty("status") ||
    !(1 < description.length && description.length <= 255) ||
    !validStatus.includes(status)
  ) {
    return res.sendStatus(400);
  }

  pool
    .query(
      "INSERT INTO tasks(description, status) VALUES($1, $2) RETURNING *",
      [description, status]
    )
    .then((response) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      res.sendStatus(500);
      console.error(error.message);
    });
});

// Get all tasks
app.get("/mytasks", (req, res) => {
  pool
    .query("SELECT * FROM tasks;")
    .then((response) => {
      res.status(200);
      res.json(response.rows);
    })
    .catch((error) => {
      res.sendStatus(500);
      console.error(error.message);
    });
});

// Get a task
app.get("/mytasks/:id", (req, res) => {
  console.log(req.body);
});

app.listen(port, hostname, () => {
  console.log(`Listening at: http://${hostname}:${port}`);
});
