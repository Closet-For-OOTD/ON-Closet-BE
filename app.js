const express = require("express");
const multer = require("multer");
const db = require("./config/database");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

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

app.get("/outfitlists", (req, res) => {
  db.query("SELECT * FROM outfitlists", (err, results) => {
    res.send(results);
  });
});

app.get("/uploadOutfit", (req, res) => {
  db.query("SELECT * FROM outfitlists", (err, results) => {
    res.send(results);
  });
});

app.post("/uploadOutfit", (req, res) => {
  console.log("body is: ", req.body.value);

  db.query(
    "UPDATE outfitlists SET img=?",
    [req.body.value.img],
    (err, results) => {
      if (err) throw err;
    }
  );
  // ! 여기 중복임.... 왜 한번에 작성하면 syntax 에러 -> 확인 후 수정!
  db.query(
    "UPDATE outfitlists SET id=?",
    [req.body.value.id],
    (err, results) => {
      if (err) throw err;
    }
  );
});

app.delete("/delete", (req, res) => {
  const removeid = req.body.removeid;
  const sql = "DELETE FROM outfit WHERE id=?";
  db.query(sql, removeid, (err, results) => {
    return res.send(results);
  });
});

app.listen(4000, () => {
  console.log("Server is running on 4000");
});
