const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const { connectDB } = require("./src/utils/db");
const cors = require("cors");

const indexRouter = require("./src/routes/index");
const userRouter = require("./src/routes/user");
const roomRouter = require("./src/routes/room");
const musicRouter = require("./src/routes/music");
const playlistRouter = require("./src/routes/playlist");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const swaggerSpec = YAML.load(path.join(__dirname, "./build/swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", indexRouter);
app.use("/api/user", userRouter);
app.use("/api/room", roomRouter);
app.use("/api/music", musicRouter);
app.use("/api/playlist", playlistRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

connectDB();

module.exports = app;
