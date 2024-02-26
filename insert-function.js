const fs = require("fs");
const path = require("path");

const functionJsContent = fs.readFileSync(
  path.join(__dirname, "function.js"),
  "utf8"
);
const sqlTemplateContent = fs.readFileSync(
  path.join(__dirname, "bigquery_template.sql"),
  "utf8"
);

const finalSqlContent = sqlTemplateContent
  .replace("PLACEHOLDER", functionJsContent)
  .replace(/import { parse } from "numbers-from-words";\n/, "")
  .replace(/parse\(/g, "webpackNumbers.parse(");

fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "dist", "bigquery.sql"), finalSqlContent);
