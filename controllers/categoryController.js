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
  },
];

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

category_details = (callback) => {
  Item.aggregate(
    [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "array",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: 1 },
          name: { $first: "$array.name" },
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

const handleCreateErrors = (res, req, errors) => {
  async.series(
    {
      category_details,
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
        console.log(err);
        return next(err);
      }

      res.render("index", {
        title: "Clothing",
        categoryDetails: results.category_details,
        items: results.items,
        selected: selected,
        errors: errors.array(),
      });
    }
  );
};
