const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const mime = require("mime"); // Import mime module

router.get("/documents/:id", (req, res) => {
  const documentId = req.params.id;
  const filePath = path.join(__dirname, "uploads", documentId);
  const contentType = mime.getType(filePath); // Use mime.getType

  // Read the file and send it as a response
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error reading document:", err);
      res.status(500).send("Error fetching document");
    } else {
      res.setHeader("Content-Type", contentType); // Set content type based on mime
      res.send(data);
    }
  });
});

module.exports = router;
