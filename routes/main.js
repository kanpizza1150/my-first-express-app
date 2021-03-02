const express = require("express");
const router = express.Router();
// ############### GET ##############
router.get("/", (req, res) => {
  res.render("index", { title: "my express app", message: "hello" }); //used in ./views/index.pug
});

module.exports = router;
