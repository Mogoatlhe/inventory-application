const express = require("express");
const router = express.Router();

const item_Controller = require("../controllers/itemController");

router.get("/", item_Controller.index);
router.get("/category/:categoryId", item_Controller.items_by_category);
router.get("/item/:itemId", item_Controller.item);

module.exports = router;
