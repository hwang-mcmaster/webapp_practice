const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("database.db");
const SALT_ROUNDS = 10;

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

async function init() {
  try {
    await runQuery("DROP TABLE IF EXISTS Users");
    await runQuery("CREATE TABLE Users (username TEXT, password TEXT, level TEXT)");

    const users = [
      ["mem1", "mem1", "member"],
      ["mem2", "mem2", "editor"],
      ["edit1", "edit1", "editor"],
      ["edit2", "edit2", "editor"]
    ];

    for (const [username, password, level] of users) {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      await runQuery("INSERT INTO Users VALUES (?,?,?)", [username, hashedPassword, level]);
    }

    await runQuery("DROP TABLE IF EXISTS Articles");
    await runQuery("CREATE TABLE Articles (title TEXT, username TEXT, content TEXT)");

    await runQuery(
      "INSERT INTO Articles VALUES (?,?,?)",
      [
        "My favourite places to eat",
        "mem1",
        "<p>My favourite places to eat are The Keg, Boston Pizza and McDonalds</p><p>What are your favourite places to eat?</p>"
      ]
    );

    await runQuery(
      "INSERT INTO Articles VALUES (?,?,?)",
      [
        "Tips for NodeJS",
        "mem2",
        "<p>The trick to understanding NodeJS is figuring out how async I/O works.</p> <p>Callback functions are also very important!</p>"
      ]
    );

    await runQuery(
      "INSERT INTO Articles VALUES (?,?,?)",
      [
        "Ontario's top hotels",
        "edit1",
        "<p>The best hotel in Ontario is the Motel 8 on highway 234</p><p>The next best hotel is The Sheraton off main street.</p>"
      ]
    );

    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Database initialization failed:", err);
  } finally {
    db.close();
  }
}

init();