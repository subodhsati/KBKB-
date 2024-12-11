const express = require("express");

const runQuery = require("../../modules/runQuery");


const router = express.Router();

module.exports = router.post("/", async (req, res) => {
  const body = req?.body;

  const easy = parseInt(body?.easy) || 0;
  const medium = parseInt(body?.medium) || 0;
  const hard = parseInt(body?.hard) || 0;

  if(easy === NaN) {
    easy = 0;
  }

  if(medium === NaN) {
    medium = 0;
  }

  if(hard === NaN) {
    hard = 0;
  }

  const questionsData = await runQuery(
    `SELECT * FROM (
      SELECT * FROM (
        SELECT * FROM questions WHERE category = 'easy' ORDER BY RANDOM() LIMIT ?
      ) AS easy
     UNION ALL
     SELECT * FROM (
       SELECT * FROM questions WHERE category = 'medium' ORDER BY RANDOM() LIMIT ?
     ) AS medium
     UNION ALL
     SELECT * FROM (
       SELECT * FROM questions WHERE category = 'hard' ORDER BY RANDOM() LIMIT ?
     ) AS hard
    ) AS combined`,
    [easy || 0, medium || 0, hard || 0]
  )

  if(questionsData?.length >= 1) {
    questionsData.forEach((data) => {
      data.options = JSON.parse(data.options);
    });
  }

  return res.json(questionsData);
});