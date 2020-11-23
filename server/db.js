const pg = require("pg");
const Pool = pg.Pool;
const env = require("../env.json");
const pool = new Pool(env);
pool.connect().then(() => {
  console.log("Connected to a database");
});

module.exports = pool;
