const mongoose = require("mongoose");
const schema = mongoose.Schema;
const courseSchema = new schema({
    code:String,
    name:String
})
module.exports = mongoose.model("courseData", courseSchema)