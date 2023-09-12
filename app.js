const express = require("express");

const app = express();
app.get("/", (req, res) => {
  res.send("Home");
  console.log("done");
});

app.listen(4000, () => {
  console.log("Server is running on 3000");
});
