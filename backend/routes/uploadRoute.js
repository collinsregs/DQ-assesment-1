const multer = require("multer");

const express = require("express");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Change "uploads/" to your desired directory (with write permissions)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Create unique filenames
  },
});

const upload = multer({ storage }); // Create a Multer instance with storage config

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    // Access uploaded file information from req.file
    const file = req.file;
    console.log("Uploaded file details:", file);

    // Process the uploaded file (e.g., save it to disk, process the data)
    // Handle potential errors gracefully (e.g., using try-catch blocks)
    // ... your processing logic with error handling ...
    const documentId = file.filename;

    res.send({ route: `/documents/${documentId}` }); // Send a success response
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).send("Error uploading file"); // Send error response
  }
});

module.exports = router;
