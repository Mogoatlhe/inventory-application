const Item = require("../models/item");
const Category = require("../models/category");
const async = require("async");
const { body, validationResult } = require("express-validator");

let selected;
let deleteSuccess = false;
exports.index = (req, res, next) => {
  async.series(
    {
      category_info,
      items(callback) {
        Item.find(
          {},
          null,
          { sort: setSortType(req.query.sortSelect) },
          callback
        );
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      let success = false;
      if (deleteSuccess) {
        deleteSuccess = false;
        success = true;
      }

      deleteUnusedImages(req._parsedOriginalUrl.pathname, results.items);

      res.render("index", {
        title: "Clothing",
        categoryDetails: results.category_info,
        items: results.items,
        selected: selected,
        errors: JSON.stringify([]),
        className: JSON.stringify("none"),
        success: success,
      });
    }
  );
};

exports.items_by_category = (req, res, next) => {
  const id = req.params.categoryId;

  async.series(
    {
      category_info,
      items(callback) {
        Item.find(
          { category: id },
          null,
          { sort: setSortType(req.query.sortSelect) },
          callback
        );
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      const currCategory = results.category_info.find(
        (detail) => id === detail._id.toString()
      );

      res.render("index", {
        title: currCategory.name,
        categoryDetails: results.category_info,
        items: results.items,
        selected: selected,
      });
    }
  );
};

exports.item = (req, res, next) => {
  const id = req.params.itemId;
  Item.findOne({ _id: id })
    .populate("category")
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }

      res.render("itemDetails", {
        results,
      });
    });
};

exports.item_update_get = (req, res, next) => {
  const id = req.params.itemId;
  async.series(
    {
      category_info,
      getItem(callback) {
        Item.findOne({ _id: id }).populate("category").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      const getItem = results.getItem.toObject();

      if (!("description" in getItem)) {
        getItem.description = "";
      }

      if (!("image" in getItem)) {
        getItem.image = null;
      }

      res.render("itemForm", {
        results,
        getItem,
      });
    }
  );
};

exports.item_update_post = [
  body("name", "item name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "item description must not be empty")
    .trim()
    .isLength({ min: 1 }),
  body("price")
    .isInt({ min: 100 })
    .withMessage("item price must be an integer above 99")
    .trim()
    .isLength({ min: 1 })
    .withMessage("item price must not be empty"),
  body("category")
    .trim()
    .isLength({ min: 1 })
    .withMessage("item category must not be empty")
    .custom((value) => doesCategoryExist(value)),
  body("count")
    .isInt({ min: 1 })
    .withMessage("item count must be an integer above 0")
    .trim()
    .isLength({ min: 1 })
    .withMessage("item count must not be empty"),
  (req, res, next) => {
    console.log(req.body.name);
    const errors = validationResult(req);

    const id = req.params.itemId;
    if (!errors.isEmpty()) {
      handleUpdateErrors(res, errors, id);
      return;
    }

    updateItem(req, res, next, id);
  },
];

exports.item_create_get = (req, res, next) => {
  async.parallel({ category_info }, (err, results) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    results.name = "Add new item";
    const getItem = {
      name: "",
      price: 0,
      description: "",
      count: 0,
      category: "",
      image: null,
    };

    res.render("itemForm", { results: results, getItem: getItem });
  });
};

exports.item_create_post = [
  body("name", "item name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "item description must not be empty")
    .trim()
    .isLength({ min: 1 }),
  body("price")
    .isInt({ min: 100 })
    .withMessage("item price must be an integer above 99")
    .trim()
    .isLength({ min: 1 })
    .withMessage("item price must not be empty"),
  body("category")
    .trim()
    .isLength({ min: 1 })
    .withMessage("item category must not be empty")
    .custom((value) => doesCategoryExist(value)),
  body("count")
    .isInt({ min: 1 })
    .withMessage("item count must be an integer above 0")
    .trim()
    .isLength({ min: 1 })
    .withMessage("item count must not be empty"),
  (req, res, next) => {
    async.parallel({ category_info }, (err, results) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      const errors = validationResult(req);
      const re = /image\/*/;
      if (req.file !== undefined && !re.test(req.file.mimetype)) {
        errors.errors.push({
          msg: "file must be of type image",
          param: "image",
        });
      }

      results.name = "Add new item";
      const getItem = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        count: req.body.count,
        category: "",
        image: req.file === undefined ? undefined : req.file.filename,
      };

      if (!errors.isEmpty()) {
        return res.render("itemForm", {
          results: results,
          getItem: getItem,
          errors: errors.array(),
        });
      }

      Category.findOne(
        { name: req.body.category },
        { _id: 1 },
        (error, category) => {
          if (error) {
            return next(error);
          }

          const item = new Item({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: category._id,
            count: req.body.count,
            image: req.file === undefined ? undefined : req.file.filename,
          });

          item.save((err, newItem) => {
            if (err) {
              return next(err);
            }

            res.redirect(`/clothing/item/${newItem._id.toString()}`);
          });
        }
      );
    });
  },
];

exports.item_delete = (req, res, next) => {
  Item.findByIdAndDelete(req.body.id, (err) => {
    if (err) {
      return next(err);
    }

    deleteSuccess = true;
    res.redirect("/");
  });
};

// helpers
const setSortType = (sortType) => {
  if (sortType === "Price Low-High") {
    selected = "Price Low-High";
    return { price: 1 };
  } else if (sortType === "Price High-Low") {
    selected = "Price High-Low";
    return { price: -1 };
  } else if (sortType === "Name Z-A") {
    selected = "Name Z-A";
    return { name: -1 };
  } else if (sortType === "Name A-Z") {
    selected = "Name A-Z";
    return { name: 1 };
  } else {
    return { _id: 1 };
  }
};

category_info = (callback) => {
  Category.aggregate(
    [
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "category",
          as: "array",
        },
      },
      {
        $addFields: {
          total: { $size: "$array" },
        },
      },
      {
        $sort: { name: 1 },
      },
    ],
    callback
  );
};

const doesCategoryExist = (name) => {
  return Category.findOne({ name: name }).then((category) => {
    if (!category) {
      return Promise.reject("item category does not exist");
    }
  });
};

const handleUpdateErrors = (res, errors, id) => {
  async.parallel(
    {
      category_info,
      getItem(callback) {
        Item.findOne({ _id: id }).populate("category").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      const getItem = results.getItem.toObject();

      if (!("description" in getItem)) {
        getItem.description = "";
      }

      if (!("image" in getItem)) {
        getItem.image = "";
      }

      res.render("itemForm", {
        results,
        getItem,
        errors: errors.array(),
        className: JSON.stringify("none"),
      });
    }
  );
};

const updateItem = (req, res, next, id) => {
  Category.findOne({ name: req.body.category }, "_id", (err, result) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    const re = /image\/*/;
    if (req.file !== undefined && !re.test(req.file.mimetype)) {
      errors.errors.push({
        msg: "file must be of type image",
        param: "image",
      });
    }
    const categoryId = result._id.toString();

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: categoryId,
      count: req.body.count,
      _id: id,
      image: req.file === undefined ? undefined : req.file.filename,
    });

    Item.findByIdAndUpdate(id, item, {}, (err) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      res.redirect(`/clothing/item/${id}`);
    });
  });
};

const deleteUnusedImages = (path, items) => {
  if (path !== "/clothing") {
    return;
  }

  const images = items
    .map((item) => item.image)
    .filter((image) => image !== undefined);
};
