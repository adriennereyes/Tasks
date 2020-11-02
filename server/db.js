const pg = require("pg");
const Pool = pg.Pool;
const pool = new Pool({
  user: "postgres",
  password: "Usausa00!",
  database: "tasksproject",
  host: "localhost",
  port: 5432,
});
pool.connect().then(() => {
  console.log("Connected to a database");
});

module.exports = pool;
