var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var multer = require("multer");

var fs = require("fs");
var path = require("path");
require("dotenv/config");
const imgModel = require("./schema/image");

const url = "mongodb://localhost:27017";
// Connecting to the database
mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log("connected");
  }
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header({
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  next();
});

// Set EJS as templating engine
app.set("view engine", "ejs");

// Retriving the images
app.get("/", (req, res) => {
  imgModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      console.log(items);
      res.render("app", { items: items });
    }
  });
});

// Retriving the image

// Retriving the image
app.get("/img", (req, res) => {
  imgModel.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      console.log(items);
      res.send(items);
    }
  });
});

app.get("/img/:id", (req, res) => {
  imgModel.find({ _id: req.params.id }, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      console.log(items);
      res.render("app", { items: items });
    }
  });
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

// Uploading the image
app.post("/uploads", upload.single("image"), (req, res, next) => {
  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };
  imgModel.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      // item.save();
      res.redirect("/");
    }
  });
});

app.listen("3013" || process.env.PORT, (err) => {
  if (err) throw err;
  console.log("Server started");
});
