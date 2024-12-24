const mongoose = require("mongoose");
const schema = mongoose.Schema;
const categorySchema = new schema({
  category: {
    type: String,
    required: true,
    enum: ["ACTION", "COMEDY", "ROMANCE", "THRILLER", "DRAMA", "HORROR"],
  },
});
const category = mongoose.model("categories", categorySchema);
module.exports.category = category;
module.exports.categorySchema = categorySchema;
