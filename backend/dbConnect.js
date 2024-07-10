const sqlite3 = require("sqlite3").verbose();

function connectToDatabase() {
  return new sqlite3.Database("./data/database/database.db", (err) => {
    if (err) {
      console.error("Error connecting to database:", err.message);
    } else {
      console.log("Connected to the SQLite database.");
    }
  });
}
const db = connectToDatabase();

module.exports = db;
