const mysql = require("mysql");

const db_config = {
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "closet",
};

const db = mysql.createConnection(db_config);
db.connect();

module.exports = db;
