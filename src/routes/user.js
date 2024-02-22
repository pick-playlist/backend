var express = require("express");
var router = express.Router();
const User = require("../models/User");
const { createToken, verifyToken } = require("../utils/auth");
const mongoose = require("mongoose");

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

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    user = await User.memberLogin(email, password);
    const tokenMaxAge = 60 * 60 * 24 * 3;
    const token = createToken(user, tokenMaxAge);

    user.token = token;

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
    });

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(400);
    next(err);
  }
});

router.post("/guest-login", async (req, res, next) => {
  try {
    const { nickname } = req.body;
    const user = await User.guestLogin(nickname);
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(400);
    next(err);
  }
});

// id로 조회
router.get("/:userId", function (req, res, next) {
  const { userId } = req.params;

  User.findById(userId)
    .then((data) => {
      if (!data)
        return res.status(404).json({
          error: {
            title: "Bad request",
            msg: "User not found.",
          },
        });
      res.json(data);
    })
    .catch((err) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(404)
          .json({ error: { title: "Bad request", msg: "Invalid user id." } });
      }
      return next(err);
    });
});

module.exports = router;
