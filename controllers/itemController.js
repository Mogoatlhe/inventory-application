const Item = require("../models/item");

exports.index = (req, res) => {
  res.render("index", { title: "Home" });
};
