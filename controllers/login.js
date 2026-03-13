const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const usersModel = require("../models/users");

// render login page
router.get("/", function(req, res) {
  res.render("login", req.TPL);
});

// render signup page
router.get("/signup", function(req, res) {
  res.render("signup", req.TPL);
});

// handle signup
router.post("/createsignup", async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || username.length < 6) {
    req.TPL.signup_error = "Error: username must be at least 6 characters long.";
    return res.render("signup", req.TPL);
  }

  if (!password || password.length < 6) {
    req.TPL.signup_error = "Error: password must be at least 6 characters long.";
    return res.render("signup", req.TPL);
  }

  try {
    const existingUser = await usersModel.getUserByUsername(username);

    if (existingUser) {
      req.TPL.signup_error = "Error: username already exists.";
      return res.render("signup", req.TPL);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await usersModel.createUser(username, hashedPassword, "member");

    req.TPL.signup_success = "Success! Account created. You can now log in.";
    res.render("signup", req.TPL);
  } catch (err) {
    console.log(err);
    req.TPL.signup_error = "Error: could not create account.";
    res.render("signup", req.TPL);
  }
});

// handle login attempt
router.post("/attemptlogin", async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await usersModel.getUserByUsername(username);

    if (!user) {
      req.TPL.login_error = "Login failed. Invalid username or password.";
      return res.render("login", req.TPL);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      req.TPL.login_error = "Login failed. Invalid username or password.";
      return res.render("login", req.TPL);
    }

    req.session.username = user.username;
    req.session.level = user.level;

    if (user.level === "editor") {
      res.redirect("/editors");
    } else {
      res.redirect("/members");
    }
  } catch (err) {
    console.log(err);
    req.TPL.login_error = "Login failed. Please try again.";
    res.render("login", req.TPL);
  }
});

module.exports = router;