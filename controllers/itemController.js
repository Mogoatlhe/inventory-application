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
        Item.find({}, callback);
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
