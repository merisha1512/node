const mongoose = require("mongoose");
const { castSchema } = require("./cast.model");
const schema = mongoose.Schema;

const movieSchema = new schema(
  {
    name: { type: String, required: true, min: 1, max: 20 },

    code: {
      type: String,
      index: { unique: true },
      required: true,
      min: 4,
      max: 4,
    },

    category: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
    },

    languages: {
      type: [{ type: String }],
      min: 1,
      max: 5,
      required: true,
    },

    duration: { type: String, required: true },

    cast: {
      type: [castSchema],
    },

    poster: { type: String, required: true },

    description: { type: String, min: 20, max: 100, required: true },

    releaseDate: { type: Date, required: true },

    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const movie = mongoose.model("Movies", movieSchema);
module.exports.movie = movie;
