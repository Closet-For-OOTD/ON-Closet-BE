const express = require("express");
const multer = require("multer");
const db = require("./config/database");
// const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use("/public", express.static("public"));

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, done) {
      done(null, "public/files/");
    },
    filename: function (req, file, done) {
      const filename = file.originalname;
      done(null, filename);
    },
  }),
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/list", (req, res) => {
  db.query("SELECT * FROM outfit", function (err, results) {
    if (err) throw err;
    res.send(results);
  });
});

app.post("/upload", upload.single("myfile"), (req, res) => {
  db.query(
    "INSERT INTO outfit(type, img) VALUES(?,?)",
    [req.body.clothingType, req.file.path],
    (err, results) => {
      if (err) throw err;
    }
  );
});

app.get("/", (req, res) => {
  console.log("연결");
  res.send("Home");
});

app.listen(4000, () => {
  console.log("Server is running on 4000");
});
