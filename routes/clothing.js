const express = require("express");
const router = express.Router();

const item_Controller = require("../controllers/itemController");

router.get("/", item_Controller.index);

module.exports = router;
