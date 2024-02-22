var express = require("express");
var router = express.Router();
const User = require("../models/User");

router.get("/", function (req, res, next) {
  User.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      return next(err);
    });
});

module.exports = router;
