const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const mime = require("mime-types");
const { Document } = require("pdf-lib");
const textract = require("textract");
const fs = require("fs/promises");
const fsR = require("fs");
const pdf = require("pdf-parse");
const { error } = require("console");
const pdfExtractor = require("./pdfExtract.cjs");
const spanReplace = require("./spanReplace.cjs");
const axios = require("axios");
const { Blob } = require("blob-polyfill");

const { connectToDatabase } = require("./dbConnect");

const db = connectToDatabase();

const app = express();
const port = 5000;

const url = "http://127.0.0.1:5000/correct";
const urlGetText = "http://127.0.0.1:5000/getText";

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data/uploads/");
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
    console.log("file at uploads", file);
    const email = req.headers["user-email"];

    const documentId = file.filename;
    const userID = await getUserID(email);
    console.log("user id:", userID);
    await addDocument(documentId, userID);

    console.log("document id at upload redirect:", documentId);
    res.send({ route: `/documents/${documentId}` });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).send("Error uploading file");
  }
});

app.post("/improve", (req, res) => {
  const originalText = req.body.originalText;
  const editText = req.body.edit;
  const id = req.body.documentId;
  const id_2 = id.replace("%20", " ");
  const document_name = path.parse(id_2).name;
  const full_document_name = `${document_name}.txt`;
  const filePath = `data/improved/${full_document_name}`;
  findAndReplace(filePath, originalText, editText).then(res.status(200).send());
});

app.get("/download/:id", (req, res) => {
  const id = req.params.id;
  let name = id.split(".")[0];
  let improvedId = name + ".txt";
  res.download(`./data/improved/${improvedId}`, "myfile.pdf"); // Specify actual file path
});

app.get("/documents/:id", cors(corsOptions), async (req, res) => {
  const documentId = req.params.id;

  try {
    let filePath = "data/uploads/" + documentId;
    let originalText = await extract(filePath);
    let extractedText = await getDocument(documentId);
    getCorrections(url, extractedText)
      .then((improvedText) => {
        const responseObject = {
          originalText: originalText,
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
app.get("/userHistory", async (req, res) => {
  const email = req.headers["user-email"];
  const userID = await getUserID(email);
  const history = await getHistory(userID);
  res.send(history);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

async function getHistory(userID) {
  const queryString = "SELECT * FROM Document WHERE user_id = ? ";
  return new Promise((resolve, reject) => {
    db.all(queryString, [userID], (err, history) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(history);
      }
    });
  });
}

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
      const formData = new FormData();
      const file = fsR.readFileSync(filePath);
      const fileBlob = new Blob([file], { type: "application/pdf" });
      formData.append("file", fileBlob, "file.pdf");
      const response = await axios.post(urlGetText, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      extractedText = response.data.text;
      console.log("extracted text:", response.data);
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
  return new Promise((resolve, reject) => {
    let userId = null; // Default to 1 if user not found
    db.get("SELECT id FROM User WHERE email = ?", [email], (err, user) => {
      if (err) {
        console.log("error getting user id", err);
        reject(err);
      } else {
        userId = user.id;
        resolve(userId);
      }
    });
  });
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

async function getDocument(documentId) {
  try {
    let extractedText;
    const filePath_upload = path.join(__dirname, "data/uploads", documentId);
    const document_name = path.parse(documentId).name;
    const full_document_name = `${document_name}.txt`;
    console.log("full", document_name);
    const txtFilePath = path.join(
      __dirname,
      "data/improved",
      full_document_name
    );

    existingDocument = await getDocumentById(documentId);
    console.log("existing document", existingDocument);
    if (existingDocument) {
      extractedText = await extract(txtFilePath);
    } else {
      extractedText = await extract(filePath_upload);
      await fs.writeFile(txtFilePath, extractedText, "utf-8");
      db.run(
        "INSERT INTO Content(id, document_id) VALUES (?,?)",
        [full_document_name, documentId],
        (err) => {
          console.log("inserting into content");
          if (err) {
            console.error("Error inserting content:", err.message);
          }
        }
      );
    }
    return extractedText;
  } catch (error) {
    console.error("Error retrieving document:", error.message);
    // Handle the error appropriately
  }
}
function getDocumentById(documentId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM Content WHERE Content.document_id = ?",
      [documentId],
      (err, existingUser) => {
        if (err) {
          console.log("", err.message);
          reject(err);
        } else {
          console.log("inside:", existingUser);
          resolve(existingUser);
        }
      }
    );
  });
}

async function findAndReplace(filePath, searchText, replaceText) {
  try {
    // Read the file content
    const content = await fs.readFile(filePath, "utf8");
    console.log("content:", content);

    // Perform the replacement using a regular expression
    let replacedContent = content;
    let currentPos = 0;
    while (
      (currentPos = replacedContent.indexOf(searchText, currentPos)) !== -1
    ) {
      replacedContent =
        replacedContent.slice(0, currentPos) +
        replaceText +
        replacedContent.slice(currentPos + searchText.length);
      currentPos += replaceText.length; // Adjust search position to avoid infinite loop
    }
    console.log("replaced Content:", replacedContent);

    // Write the updated content back to the file
    await fs.writeFile(filePath, replacedContent, "utf8");

    console.log(`Text replaced in file: ${filePath}`);
  } catch (error) {
    console.error(`Error replacing text: ${error.message}`);
    // Handle the error appropriately (e.g., send an error response)
  }
}
