const Item = require("../models/item");
const async = require("async");
const { body, validationResult } = require("express-validator");

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
        title: results.name,
        itemCount: results.count,
        itemId: id,
        price: results.price,
        categoryName: results.category.name,
        categoryId: results.category._id,
      });
    });
};

exports.item_update_get = (req, res, next) => {
  const id = req.params.itemId;
  Item.findOne({ _id: id })
    .populate("category")
    .exec(function (err, results) {
      if (err) {
        console.log(err);
        return next(err);
      }

      res.render("itemForm", {
        title: results.name,
        itemCount: results.count,
        itemId: id,
        price: results.price,
        categoryName: results.category.name,
        categoryId: results.category._id,
      });
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
