const mongoose = require("mongoose");
const schema = mongoose.Schema;
const castSchema = new schema({

    pic: { type: String },
    name: { type: String },
    age:{type:Number}
  
});
const cast = mongoose.model("cast", castSchema);
module.exports.cast = cast;
module.exports.castSchema = castSchema;
