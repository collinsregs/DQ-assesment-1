const path = require("path");
const fs = require("fs");
const pdf = require("pdf-parse");
const assert = require("assert");

const extractText = async (pathStr) => {
  assert(fs.existsSync(pathStr), `Path does not exist ${pathStr}`);
  const pdfFile = path.resolve(pathStr);
  const dataBuffer = fs.readFileSync(pdfFile);
  const data = await pdf(dataBuffer);
  return data.text;
};

module.exports = { extractText };
