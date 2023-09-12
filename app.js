const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");

const app = express();

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, done) {
      done(null, "public/files");
    },
    filename: function (req, file, done) {
      const filename = file.originalname;
      done(null, filename);
    },
  }),
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("연결");
  res.send("Home");
});

app.listen(4000, () => {
  console.log("Server is running on 4000");
});
