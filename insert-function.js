const fs = require("fs");
const path = require("path");

const initialJsContent = fs.readFileSync(
  path.join(__dirname, "dist", "out.js"),
  "utf8"
);
const sqlTemplateContent = fs.readFileSync(
  path.join(__dirname, "bigquery_template.sql"),
  "utf8"
);

const removedSqlContent = initialJsContent.replace(
  /\/\/ REMOVE THIS FOR BIGQUERY.*/m,
  ""
);

const finalJsContent = (
  removedSqlContent + "return standardizeAddress(address);"
).replace(/\\/g, "\\\\");

const finalSqlContent = sqlTemplateContent.replace(
  "PLACEHOLDER",
  finalJsContent
);

// FIXME i have to replace \ with \\ or bigquery won't accept

fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "dist", "bigquery.sql"), finalSqlContent);
