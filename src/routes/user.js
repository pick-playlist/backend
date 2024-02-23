var express = require("express");
var router = express.Router();
const User = require("../models/User");
const { createToken, verifyToken } = require("../utils/auth");
const mongoose = require("mongoose");

const TOKEN_MAX_AGE = 60 * 60 * 24 * 3;

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
    const token = createToken(user, TOKEN_MAX_AGE);
    user.token = token;

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: TOKEN_MAX_AGE * 1000,
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
    const token = createToken(user, TOKEN_MAX_AGE);
    user.token = token;

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: TOKEN_MAX_AGE * 1000,
    });

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(400);
    next(err);
  }
});

router.all("/logout", async (req, res, next) => {
  try {
    let token;
    // 회원일 경우 email, password
    if (req.body.email && req.body.password) {
      const user = await User.memberLogin(req.body.email, req.body.password);
      token = createToken(user, TOKEN_MAX_AGE);
    }
    // 비회원일 경우 nickname
    else if (req.body.nickname) {
      const user = await User.guestLogin(req.body.nickname);
      token = createToken(user, TOKEN_MAX_AGE);
    }

    res.cookie("authToken", token, {
      httpOnly: true,
      expires: new Date(Date.now()),
    });

    res.json({ message: "Success logout" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Failed logout" });
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

// 유저 정보 수정
router.put("/:userId", function (req, res, next) {
  const { userId } = req.params;
  const updatedData = req.body;

  User.findByIdAndUpdate(userId, updatedData, { returnOriginal: false })
    .then((user) => {
      if (!user)
        return res.status(404).json({
          error: {
            title: "Bad request",
            msg: "User not found.",
          },
        });
      res.json(user.visibleUser);
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

// 일부 유저 조회
router.post("/", function (req, res, next) {
  const { userIds } = req.body;

  const areValidUserIds = userIds.every((userId) =>
    mongoose.Types.ObjectId.isValid(userId)
  );

  if (!areValidUserIds) {
    return res
      .status(400)
      .json({ error: { title: "Bad request", msg: "Invalid user id." } });
  }

  User.find({ _id: { $in: userIds } })
    .then((data) => {
      if (!data)
        return res.status(404).json({
          error: {
            title: "Bad request",
            msg: "Users not found.",
          },
        });
      res.json(data);
    })
    .catch((err) => {
      return next(err);
    });
});

module.exports = router;
