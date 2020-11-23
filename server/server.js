require("dotenv").config();
const express = require("express");
const pool = require("./db");
const authRouter = require("./routes/auth");
const tasksRouter = require("./routes/tasks");
const cors = require("cors");

const app = express();

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

// Middleware
app.use(cors());
app.use(express.json());


// MIDDLEWARE ROUTES //
app.use('/', authRouter);
app.use('/tasks', tasksRouter);

app.listen(port, hostname, () => {
  console.log(`Listening at: http://${hostname}:${port}`);
});
