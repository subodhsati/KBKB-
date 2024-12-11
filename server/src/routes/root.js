const express = require("express");

const router = express.Router();

const questions = require("./fetch/questions");
const prizes = require("./fetch/prizes");

module.exports = router.use("/fetch/questions", questions);
module.exports = router.use("/fetch/prizes", prizes);

