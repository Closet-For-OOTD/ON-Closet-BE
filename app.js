const express = require("express");
const db = require("./config/database");

const app = express();
app.get("/", (req, res) => {
  db.query("SELECT * FROM outfit", function (err, result) {
    console.log(result);
    res.send(result);
  });
});

app.listen(4000, () => {
  console.log("Server is running on 4000");
});
