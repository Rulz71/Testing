const express = require("express");
const fileUpload = require("express-fileupload");

const pdfParse = require("pdf-parse");
const port = 3000;
var XLSX = require("xlsx");


const app = express();

app.use("/", express.static("public"));
app.use(fileUpload());

app.post("/extract-text", (req, res) => {
  //For Empty files
  if (!req.files && !req.files.pdfFile) {
    res.status(400);
    res.end();
  }

  const fileName = req.files.pdfFile.name;
  const fileType = fileName.split(".").pop();

  if (fileType === "pdf") {
    pdfParse(req.files.pdfFile).then((result) => {
      res.send(result.text);
    });
  } else if (fileType === "xlsx") {
    const workbook = XLSX.read(req.files.pdfFile.data);
    // Access the first sheet
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    // Convert the sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    res.send(jsonData);
  } else {
    res.send("Only PDF and Excel files can be converted.");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
