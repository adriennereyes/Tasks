const express = require("express");
const pg = require("pg");
const app = express();

const port = 3000;
const hostname = "localhost";

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200);
    res.header('Content-Type', "text/html");
    res.send(`<h1>Hello</h1>`);
});

app.listen(port, hostname, () => {
    console.log(`Listening at: http://${hostname}:${port}`);
});