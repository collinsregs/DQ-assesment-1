const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

function connectToDatabase() {
  const db = new sqlite3.Database("./data/database/database.db", (err) => {
    if (err) {
      console.error("Error connecting to database:", err.message);
    } else {
      console.log("Connected to the SQLite database.");

      // Read the schema file
      const schemaPath = "./data/database.sql";
      fs.readFile(schemaPath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading schema file:", err.message);
          return;
        }

        // Execute the schema SQL
        db.exec(data, (err) => {
          if (err) {
            console.error("Error executing schema SQL:", err.message);
          } else {
            console.log("Database schema created or already exists.");
          }
        });
      });
    }
  });

  return db;
}

module.exports = { connectToDatabase };
