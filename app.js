const express = require("express");
const multer = require("multer");
const db = require("./config/database");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

// ! 로그인 & 회원가입
const session = require("express-session");
const sessionOption = require("./config/sessionOption");
const MySQLStore = require("express-mysql-session")(session);
const sessionStore = new MySQLStore(sessionOption);
const bcrypt = require("bcrypt");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/public", express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/authcheck", (req, res) => {
  const sendData = { isLogin: "" };
  if (req.session.is_logined) {
    sendData.isLogin = "True";
  } else {
    sendData.isLogin = "False";
  }
  res.send(sendData);
});

app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

app.post("/login", (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;
  const sendData = { isLogin: "" };

  if (id && pw) {
    db.query("SELECT * FROM userTable WHERE id= ?", [id], (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        bcrypt.compare(pw, results[0].pw, (err, result) => {
          if (result === true) {
            console.log("wowowowo:", req.session);
            req.session.is_logined = true;
            req.session.nickname = id;

            // req.session.save 실행시 session 데이터를 즉시 저장
            req.session.save(function () {
              sendData.isLogin = "True";
              res.send(sendData);
            });
            db.query(
              "INSERT INTO logTable (created, id, actiondetail) VALUES (Now() ,?, 'login')",
              [req.session.nickname],
              (err, result) => {
                if (err) throw err;
                console.log(result);
              }
            );
          } else {
            sendData.isLogin = "비밀번호가 일치하지 않습니다";
            res.send(sendData);
          }
        });
      } else {
        sendData.isLogin = "아이디가 존재하지 않습니다.";
        res.send(sendData);
      }
    });
  } else {
    sendData.isLogin = "아이디와 비밀번호를 입력하세요?";
    res.send(sendData);
  }
});

app.post("/signin", (req, res) => {
  // console.log("회원가입 - req.session :   ", req.session);
  const id = req.body.id;
  const password = req.body.pw;
  const passwordCheck = req.body.pwCheck;

  const sendData = { isSuccess: "" };

  if (id && password && passwordCheck) {
    db.query("SELECT * FROM userTable WHERE id =?", [id], (err, results) => {
      if (err) throw err;
      // user 테이블에서 id가 id인 row를 찾아 results에 data저장 -> results의 길이가 0이면 해당 id는 테이블에 존재x
      if (results.length <= 0 && password === passwordCheck) {
        const hashedPassword = bcrypt.hashSync(password, 10);

        db.query(
          "INSERT INTO userTable (id, pw ) VALUES(?, ?)",
          [id, hashedPassword],
          (err, data) => {
            if (err) throw err;
            console.log("data : ", data);
            req.session.save(function () {
              sendData.isSuccess = "True";
              res.send(sendData);
            });
          }
        );
      } else if (password !== passwordCheck) {
        sendData.isSuccess = "입력된 비밀번호가 다릅니다.";
        res.send(sendData);
      } else {
        sendData.isSuccess = "이미 존재하는 아이디입니다.";
        res.send(sendData);
      }
    });
  } else {
    if (id == "") {
      sendData.isSuccess = "아이디를 입력하세요";
      res.send(sendData);
    } else if (password == "") {
      sendData.isSuccess = "비밀번호를 입력하세요";
      res.send(sendData);
    } else {
      sendData.isSuccess = "비밀번호 확인을 입력하세요";
      res.send(sendData);
    }
  }
});

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

app.get("/list", (req, res) => {
  db.query("SELECT * FROM outfit", function (err, results) {
    if (err) throw err;
    res.send(results);
  });
});

// ! error -> path 못찾을떄 존재함! -> fileupload 방식 변경하고 test 진행!
app.post("/upload_cloth", upload.single("myfile"), (req, res) => {
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
