const runQuery = require("./runQuery");
const xlsx = require("xlsx");
const fs = require("node:fs");

module.exports = async () => {
  console.log("Initializing DB");
  
  await runQuery(`CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    correct_option INT NOT NULL,
    options TEXT NOT NULL DEFAULT '[]',
    category TEXT NOT NULL
  )`);

  await runQuery(`DELETE FROM questions`);

  await runQuery(`CREATE TABLE IF NOT EXISTS prizes (
    level INTEGER PRIMARY KEY,
    amount INTEGER NOT NULL
    )`);

  const workbook = xlsx.readFile(__dirname + "/../data/Questions.xlsx");

  const sheetName = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[sheetName];

  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  // console.log(jsonData);

  const removeNewLine = (string) => {
    string = `${string}`;

    while(string.includes("\n") || string.includes("\\n")) {
      string = string.replace("\n", "").replace("\\n", "");
    }

    return string;
  }

  for(const data of jsonData) {
    const question = data.question;
    const options = [removeNewLine(data.option1), removeNewLine(data.option2), removeNewLine(data.option3), removeNewLine(data.option4)];
    const correctOption = options.indexOf(removeNewLine(data.correct_option)) + 1;
    const category = data.difficulty;

    await runQuery(
      "INSERT INTO questions (question, correct_option, options, category) VALUES (?, ?, ?, ?)",
      [question, correctOption, JSON.stringify(options), category]
    )
  }
};