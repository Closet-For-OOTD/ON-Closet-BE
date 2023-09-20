const express = require("express");
const multer = require("multer");
const db = require("./config/database");
const cors = require("cors");
const bodyParser = require("body-parser");

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

// ! error -> path 못찾을떄 존재함! -> fileupload 방식 변경하고 test 진행!
app.post("/upload", upload.single("myfile"), (req, res) => {
  console.log("*&^^%$%#$#$:", req.file.path);
  db.query(
    "INSERT INTO outfit(type, img) VALUES(?,?)",
    [req.body.clothingType, req.file.path],
    (err, results) => {
      if (err) throw err;
      console.log(results);
    }
  );
});

app.get("/outfitList", (req, res) => {
  db.query("SELECT * FROM outfitList", (err, results) => {
    res.send(results);
  });
});

app.get("/uploadOutfit", (req, res) => {
  db.query("SELECT * FROM outfitLIST", (err, results) => {
    res.send(results);
  });
});
// 착장 페이지
app.post("/uploadOutfit", (req, res) => {
  console.log("body is: ", req.body.value);
  db.query(
    "INSERT INTO outfitList (id, type, img) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE id= ?, img=? ",
    [
      req.body.value.id,
      req.body.value.type,
      req.body.value.img,
      req.body.value.id,
      req.body.value.img,
    ],
    (err, results) => {
      if (err) throw err;
      res.send(results);
    }
  );
});

app.delete("/delete", (req, res) => {
  const removeid = req.body.removeid;
  const sql = "DELETE FROM outfit WHERE ID=?";
  db.query(sql, removeid, (err, results) => {
    return res.send("success");
  });
});

app.listen(4000, () => {
  console.log("Server is running on 4000");
});
