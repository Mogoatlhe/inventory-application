const { Schema } = require("mongoose");

const CategorySchema = new Schema({
  name: { type: String, minLength: 1 },
  description: { type: String, minLength: 1 },
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
});

CategorySchema.virtual("url").get(function () {
  return `/category/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
