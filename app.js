const express = require('express');
const app = express();
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const fs = require("fs");

// Include the mustache engine to help us render our pages
app.engine("mustache", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// We use the .urlencoded middleware to process form data in the request body,
// which is something that occurs when we have a POST request.
app.use(express.urlencoded({extended: false}));

app.use(function(req, res, next) {
  const now = new Date().toLocaleString();
  const path = req.path;
  const ip = req.ip;
  const query = JSON.stringify(req.query);
  const body = JSON.stringify(req.body);

  const logLine = `"${now}","${path}","${ip}","${query}","${body}"\n`;

  fs.appendFile("log.txt", logLine, function(err) {
    if (err) {
      console.log("Error writing to log file:", err);
    }
    next();
  });
});

// Use the session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

// Create a middleware to populate an initial template array
app.use(function(req, res, next) {

  // reset the template obect to a blank object on each request
  req.TPL = {};

  // decide whether to display the login or logout button in the navbar
  req.TPL.displaylogin = !req.session.username;
  req.TPL.displaylogout = req.session.username;

  next();
});

// Create middlewares for setting up navigational highlighting
app.use("/home",
        function(req, res, next) { req.TPL.homenav = true; next(); });
app.use("/articles",
        function(req, res, next) { req.TPL.articlesnav = true; next(); });
app.use("/members",
        function(req, res, next) { req.TPL.membersnav = true; next(); });
app.use("/editors",
        function(req, res, next) { req.TPL.editorsnav = true; next(); });
app.use("/login",
        function(req, res, next) { req.TPL.loginnav = true; next(); });

// protect access to the members page, re direct user to home page if nobody
// is logged in
app.use("/members", function(req, res, next) {
  if (req.session.username) next();
  else res.redirect("/home");
});

// Include Controllers
app.use("/home", require("./controllers/home"));
app.use("/articles", require("./controllers/articles"));
app.use("/members", require("./controllers/members"));
app.use("/editors", require("./controllers/editors"));
app.use("/login", require("./controllers/login"));

// route / to /home by default
app.get("/", function(req, res) {
  res.redirect("/home");
});

// Catch all router case
app.get(/^(.+)$/, function(req, res) {
  res.sendFile(__dirname + req.params[0]);
});

// Start the server
var server = app.listen(8081, function() {
  console.log("Server listening...");
});