const Item = require("../models/item");
const async = require("async");

exports.index = (req, res, next) => {
  async.series(
    {
      category_details(callback) {
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
          ],
          callback
        );
      },
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
        title: "Home",
        categoryDetails: results.category_details,
        items: results.items,
      });
    }
  );
};

// helpers
const setSortType = (sortType) => {
  if (sortType === "Price Low-High") {
    return { price: 1 };
  } else if (sortType === "Price High-Low") {
    return { price: -1 };
  } else if (sortType === "Name Z-A") {
    return { name: -1 };
  } else if (sortType === "Name A-Z") {
    return { name: 1 };
  } else {
    return { _id: 1 };
  }
};
