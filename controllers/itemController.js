const Item = require("../models/item");
const async = require("async");
const { body, validationResult } = require("express-validator");
const { count } = require("../models/item");

let selected;
exports.index = (req, res, next) => {
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
        return next(err);
      }

      res.render("index", {
        title: "Clothing",
        categoryDetails: results.category_details,
        items: results.items,
        selected: selected,
      });
    }
  );
};

exports.items_by_category = (req, res, next) => {
  const id = req.params.categoryId;

  async.series(
    {
      category_details,
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

      const currCategory = results.category_details.find(
        (detail) => id === detail._id.toString()
      );

      res.render("index", {
        title: currCategory.name,
        categoryDetails: results.category_details,
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
      category_details,
      getItem(callback) {
        Item.findOne({ _id: id }).populate("category").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        console.log("err");
        return next(err);
      }

      const getItem = results.getItem.toObject();
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
  (req, res, next) => {
    const errors = validationResult(req);

    const id = req.params.itemId;
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      count: req.body.count,
      _id: id,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          category_details,
          getItem(callback) {
            Item.findOne({ _id: id }).populate("category").exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            console.log(err);
            return next(err);
          }

          console.log(results.toObject());
          res.render("itemForm", {
            results,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    Item.findByIdAndUpdate(id, item, {}, (err, updateBook) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      res.redirect(`/clothing/item/${id}`);
    });
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
