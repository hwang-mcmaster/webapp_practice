const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM Users WHERE username = ?",
      [username],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

function createUser(username, password, level) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO Users VALUES (?, ?, ?)",
      [username, password, level],
      function(err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM Users", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function deleteUser(username) {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM Users WHERE username = ?",
      [username],
      function(err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

module.exports = {
  getUserByUsername,
  createUser,
  getAllUsers,
  deleteUser
};