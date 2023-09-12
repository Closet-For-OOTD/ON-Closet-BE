const express = require("express");
const app = express();

app.get("/", (req, res) => {
  console.log("연결");
  res.send("Home");
});

app.listen(4000, () => {
  console.log("Server is running on 4000");
});
