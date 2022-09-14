const Item = require("../models/item");

exports.index = async (req, res) => {
  const categoryDetails = await Item.aggregate([
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
  ]);

  res.render("index", { title: "Home", categoryDetails: categoryDetails });
};
