const Item = require("../models/item");
const Category = require("../models/category");
const async = require("async");
const { body, validationResult } = require("express-validator");

let selected;
exports.category_create = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("category name cannot be empty")
    .custom((value) => doesCategoryExist(value))
    .isLength({ max: 25 })
    .withMessage("category name too long, max 25"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      handleCreateErrors(res, req, errors);
      return;
    }

    const category = new Category({ name: req.body.name });
    category.save((err) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      handleCreateErrors(res, req, errors);
    });
  },
];

exports.category_update = [
  body("categoryName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("category name cannot be empty")
    .isLength({ max: 25 })
    .withMessage("category name too long, max 25"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      handleCreateErrors(res, res, errors, req.body.editBtn);
      return;
    }

    Category.findOne({ name: req.body.categoryName }, (err, result) => {
      if (err) {
        return next(err);
      }

      if (result !== null) {
        const itemExist = [
          {
            param: "categoryName",
            msg: "category name must be unique",
          },
        ];
        handleCreateErrors(res, req, itemExist, req.body.editBtn);
        return;
      }

      const category = new Category({ name: req.body.categoryName });
      Category.findByIdAndUpdate(req.body.categoryId, category, {}, (err) => {
        if (err) {
          return next(err);
        }

        handleCreateErrors(res, req, errors, req.body.editBtn);
      });
    });
  },
];

exports.category_delete = (req, res, next) => {
  console.log("hello");
  Category.findByIdAndRemove(req.params.id, (error, results) => {
    if (error) {
      console.log(err);
      return next(err);
    }

    res.redirect("/clothing");
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
    if (category) {
      return Promise.reject("category already exists");
    }
  });
};

const handleCreateErrors = (res, req, errors, className = "none") => {
  const sortSelect = req.query === undefined ? "Sort" : req.query.sortSelect;
  async.series(
    {
      category_info,
      items(callback) {
        Item.find({}, null, { sort: setSortType(sortSelect) }, callback);
      },
    },
    (err, results) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      const newErrors = Array.isArray(errors) ? errors : errors.array();
      res.render("index", {
        title: "Clothing",
        categoryDetails: results.category_info,
        items: results.items,
        selected: selected,
        errors: JSON.stringify(newErrors),
        className: JSON.stringify(className),
      });
    }
  );
};
