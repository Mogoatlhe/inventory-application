const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "./../public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "." + file.originalname.split(".")[1]); //Appending extension
  },
});
const upload = multer({ storage: storage });

const item_Controller = require("../controllers/itemController");
const category_Controller = require("../controllers/categoryController");

router.get("/", item_Controller.index);
router.get("/category/:categoryId", item_Controller.items_by_category);
router.get("/item/create", item_Controller.item_create_get);
router.post(
  "/item/create",
  upload.single("image"),
  item_Controller.item_create_post
);
router.post("/item/delete", item_Controller.item_delete);
router.get("/item/:itemId", item_Controller.item);
router.get("/item/:itemId/edit", item_Controller.item_update_get);
router.post(
  "/item/:itemId/edit",
  upload.single("image"),
  item_Controller.item_update_post
);
router.post("/", category_Controller.category_create);
router.get("/category/delete/:id", category_Controller.category_delete);
router.post("/:id", category_Controller.category_update);

module.exports = router;
