const express = require("express");

const runQuery = require("../../modules/runQuery");

const router = express.Router();

module.exports = router.post("/", async (req, res) => {
  const body = req?.body;

  const level = parseInt(body?.level);
  
  let query = "SELECT * FROM prizes";
  let values = [];

  if(typeof level === "number" && level > 0) {
    query += " WHERE level = ?"
    values.push(level);
  } else {
    query += " ORDER BY level DESC";
  }

  res.json(
    await runQuery(query, values)
  );
});