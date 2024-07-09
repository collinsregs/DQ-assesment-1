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
const spanReplace = require("./spanReplace.cjs");
const axios = require("axios");

const app = express();
const port = 5000;

const url = "http://127.0.0.1:5000/correct";

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

app.use(express.json());

app.post("/user", (req, res) => {
  const user = req.body.user;
  if (user) {
    console.log("USER", user);
  }
  res.status(200).send("");
});

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
    let extractedText = await extract(filePath);
    getCorrections(url, extractedText)
      .then((improvedText) => {
        const responseObject = {
          originalText: extractedText,
          improvedText: improvedText,
        };
        res.setHeader("Content-Type", "application/json");
        res.send(responseObject);
      })
      .catch((error) => {
        console.error("Error getting corrections:", error);
        res.status(500).send("error getting text");
      });
  } catch (error) {
    console.log("error getting texts", error);
    res.status(500).send("error getting text");
    return;
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

async function getCorrections(url, text) {
  data = { document: text };
  console.log("getting corrections");
  formattedText = await axios
    .post(url, data)
    .then((response) => {
      const correctedText = response.data.corrected_text;
      console.log("corrected text received");
      let formattedText = spanReplace.extractAndReplace(correctedText);
      return formattedText;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  return formattedText;
}

async function extract(filePath) {
  try {
    const extension = path.extname(filePath).toLowerCase();
    let extractedText;

    if (extension === ".pdf") {
      extractedText = await pdfExtractor.extractText(filePath);
    } else {
      // Use textract for non-PDF formats (promise-based approach)
      extractedText = await new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, (err, text) => {
          if (err) {
            reject(err);
          } else {
            resolve(text);
          }
        });
      });
    }

    return extractedText; // Return the extracted text
  } catch (err) {
    console.error("Error extracting text:", err);
    throw err; // Or handle the error here and return a default value
  }
}
