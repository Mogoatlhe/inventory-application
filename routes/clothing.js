const express = require("express");
const router = express.Router();

const item_Controller = require("../controllers/itemController");
const category_Controller = require("../controllers/categoryController");

router.get("/", item_Controller.index);
router.get("/category/:categoryId", item_Controller.items_by_category);
router.get("/item/:itemId", item_Controller.item);
router.get("/item/:itemId/edit", item_Controller.item_update_get);
router.post("/item/:itemId/edit", item_Controller.item_update_post);
router.post("/", category_Controller.category_create);
// router.delete("/:id", category_Controller.category_delete);
router.get("/category/delete/:id", category_Controller.category_delete);

module.exports = router;
