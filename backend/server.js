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

const db = require("./dbConnect");

const app = express();
const port = 5000;

const url = "http://127.0.0.1:5000/correct";

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

const storage_uploads = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const storage_improved = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data/improved/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage_uploads });
const improved = multer({ storage_improved });

app.use(express.json());

app.post("/user", (req, res) => {
  const user = req.body.user;
  if (user) {
    console.log(user);
    db.get(
      "SELECT * FROM User WHERE User.email = ?",
      [user.email],
      (err, existingUser) => {
        if (err) {
          console.error("Error checking for existing user:", err.message);
          return;
        }
        console.log("existing user:", existingUser);
        if (!existingUser) {
          console.log("adding user");
          const insertQuery = "INSERT INTO User (name, email) VALUES (?,?)";
          db.run(insertQuery, [user.name, user.email], (err) => {
            if (err) {
              console.error("Error inserting user:", err.message);
              return res.status(500).send("Internal server error");
            }
          });
        }
        res.status(200).send("");
      }
    );
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const email = req.headers["user-email"];

    const documentId = file.filename;
    userID = await getUserID(email);
    await addDocument(userID, documentId);
    res.send({ route: `/documents/${documentId}` });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).send("Error uploading file");
  }
});

app.post("/improve", (req, res) => {
  console.log(req.body);
});

app.get("/documents/:id", cors(corsOptions), async (req, res) => {
  const documentId = req.params.id;
  const filePath_upload = path.join(__dirname, "data/uploads", documentId);
  const filePath_improve = path.join(__dirname, "data/improved", documentId);

  try {
    let extractedText = getDocument(
      documentId,
      filePath_upload,
      filePath_improve
    );
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

async function getUserID(email) {
  let userId = 2; // Default to 1 if user not found
  const userResult = await db.get("SELECT id FROM User WHERE email = ?", [
    email,
  ]);
  if (userResult) {
    userId = userResult.id;
  }
  return userId;
}

async function addDocument(documentId, userId) {
  const insertString =
    "INSERT INTO Document (id, user_id, upload_date) VALUES (?,?,?)";
  const date = new Date();

  db.run(insertString, [documentId, userId, date], (err) => {
    if (err) {
      console.error("Error inserting document:", err.message);
    }
  });
}

async function getDocument(documentId, filePathUpload, filePathImprove) {
  try {
    let extractedText;

    const existingDocument = await db.get(
      "SELECT * FROM Content WHERE Content.document_id = ?",
      [documentId]
    );

    if (existingDocument) {
      extractedText = await extract(filePathImprove);
    }

    if (!extractedText) {
      extractedText = await extract(filePathUpload);
      await fs.writeFile(filePathImprove, extractedText);
      db.run(
        "INSERT INTO Content(id, document_id) VALUES (?,?)",
        [documentId, documentId],
        (err) => {
          console.error("Error inserting content:", err.message);
        }
      );
    }

    return extractedText;
  } catch (error) {
    console.error("Error retrieving document:", error.message);
    // Handle the error appropriately
  }
}
