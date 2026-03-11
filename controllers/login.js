const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const usersModel = require("../models/users");

// render login page
router.get("/", function(req, res) {
  res.render("login", req.TPL);
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