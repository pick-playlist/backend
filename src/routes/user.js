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

router.post("/signup", async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;
    console.log(req.body);

    // 이메일 중복 체크
    const isDuplicatedEmail = await User.isDuplicatedEmail(email);

    if (isDuplicatedEmail)
      return res.status(409).json({
        error: {
          title: "Bad request",
          msg: "This email is already in use. Please use a different email.",
        },
      });
    else {
      const user = await User.signUp(email, nickname, password);
      res.status(201).json(user);
    }
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});
module.exports = router;
