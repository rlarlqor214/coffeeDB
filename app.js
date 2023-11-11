var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const session = require("express-session");
const sessionStore = require("./db/session");
const indexRouter = require("./src/routes/index");
const createRouter = require("./src/routes/create");
const loginRouter = require("./src/routes/login");
const menuRouter = require("./src/routes/menu");
const detailRouter = require("./src/routes/detail");
const basketRouter = require("./src/routes/basket");
const searchRouter = require("./src/routes/search");
const orderRouter = require("./src/routes/order");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(
  session({
      secret: "sessionkey",
      resave: false,
      saveUninitialized: true,
      store: sessionStore,
  })
);

app.use("/", indexRouter);
app.use("create", createRouter);
app.use("login", loginRouter);
app.use("menu", menuRouter);
app.use("search", searchRouter);
app.use("detail", detailRouter);
app.use("basekt", basketRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
