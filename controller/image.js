var fs = require("fs");
var path = require("path");
var multer = require("multer");
const { model } = require("mongoose");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

module.export = upload;