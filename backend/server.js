const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const mime = require("mime-types");
const { Document } = require("pdf-lib");
const textract = require("textract");
const fs = require("fs");
const pdf = require("pdf-parse");
const { error } = require("console");
const pdfExtractor = require("./pdfExtract.cjs");

const app = express();
const port = 5000;

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    const file = req.file;
    console.log("Uploaded file details:", file);

    const documentId = file.filename;

    res.send({ route: `/documents/${documentId}` });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).send("Error uploading file");
  }
});

app.get("/documents/:id", cors(corsOptions), async (req, res) => {
  const documentId = req.params.id;
  const filePath = path.join(__dirname, "uploads", documentId);

  try {
    const data = await fs.promises.readFile(filePath);
    const contentType = mime.lookup(filePath);
    const extension = path.extname(filePath).toLowerCase();

    let extractedText;

    if (extension === ".pdf") {
      extractedText = await pdfExtractor.extractText(filePath);
      console.log("extracted text", extractedText);
    } else {
      // Use textract for non-PDF formats
      textract.fromFileWithPath(filePath, (err, text) => {
        if (err) {
          console.error("Error extracting text:", err);
          res.status(500).send("Error fetching document");
        } else {
          extractedText = text;
        }
        // Send response after processing is complete
      });
    }
    res.setHeader("Content-Type", "text/plain");
    res.send(extractedText);
  } catch (err) {
    console.error("Error extracting text:", err);
    res.status(500).send("Error fetching document");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
