const { Schema, default: mongoose } = require("mongoose");

const ItemSchema = new Schema({
  name: { type: String, minLength: 1, maxLength: 100 },
  descritption: { type: String, minLength: 1, maxLength: 100 },
  price: { type: Number },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  count: { type: Number },
  image: { type: String },
});

ItemSchema.virtual("url").get(function () {
  return `/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
