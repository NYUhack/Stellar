const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan"); //http request logger (records every http requests)

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const logInRouter = require("./routes/credentials/login");
const signInRouter = require("./routes/credentials/signup");
const stellarRouters = require("./routes/stellar/path_payment");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/login", logInRouter);
app.use("/signin", signInRouter);
app.use("/payments", stellarRouters);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// exports.schedule = functions.https.onRequest(app);
const port = process.env.PORT || "3000";

app.listen(port, () => {
  console.log("yayyyyy");
});
