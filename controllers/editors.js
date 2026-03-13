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

router.get("/deletearticle/:title", async function(req, res) {
  try {
    await articlesModel.deleteArticle(req.params.title);
    res.redirect("/editors");
  } catch (err) {
    console.log(err);
    req.TPL.error = "Error deleting article.";

    const users = await usersModel.getAllUsers();
    const articles = await articlesModel.getAllArticles();

    req.TPL.users = users;
    req.TPL.articles = articles;

    res.render("editors", req.TPL);
  }
});

router.get("/deleteuser/:username", async function(req, res) {
  try {
    await articlesModel.deleteArticlesByUsername(req.params.username);
    await usersModel.deleteUser(req.params.username);
    res.redirect("/editors");
  } catch (err) {
    console.log(err);
    req.TPL.error = "Error deleting user.";

    const users = await usersModel.getAllUsers();
    const articles = await articlesModel.getAllArticles();

    req.TPL.users = users;
    req.TPL.articles = articles;

    res.render("editors", req.TPL);
  }
});

module.exports = router;