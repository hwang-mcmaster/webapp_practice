const express = require("express");
const router = express.Router();
const articlesModel = require("../models/articles");

// render members page
router.get("/", function(req, res) {
  res.render("members", req.TPL);
});

// create article
router.post("/create", async function(req, res) {
  const title = req.body.title;
  const content = req.body.content;

  try {
    await articlesModel.createArticle(title, req.session.username, content);
    req.TPL.message = "Article created successfully.";
  } catch (err) {
    console.log(err);
    req.TPL.message = "Error creating article.";
  }

  res.render("members", req.TPL);
});

module.exports = router;