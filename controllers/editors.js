const express = require("express");
const router = express.Router();
const usersModel = require("../models/users");
const articlesModel = require("../models/articles");

router.get("/", async function(req, res) {
  try {
    const users = await usersModel.getAllUsers();
    const articles = await articlesModel.getAllArticles();

    req.TPL.users = users;
    req.TPL.articles = articles;

    res.render("editors", req.TPL);
  } catch (err) {
    console.log(err);
    req.TPL.error = "Error loading editor dashboard.";
    res.render("editors", req.TPL);
  }
});

module.exports = router;