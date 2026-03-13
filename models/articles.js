const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

function getAllArticles() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM Articles", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function createArticle(title, username, content) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO Articles VALUES (?, ?, ?)",
      [title, username, content],
      function(err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

function deleteArticle(title) {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM Articles WHERE title = ?",
      [title],
      function(err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

module.exports = {
  getAllArticles,
  createArticle,
  deleteArticle
};