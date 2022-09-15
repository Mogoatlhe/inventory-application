const Item = require("../models/item");
const async = require("async");

exports.index = (req, res, next) => {
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
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("index", { title: "Home", categoryDetails: results });
    }
  );
};
