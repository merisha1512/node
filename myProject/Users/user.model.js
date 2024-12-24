const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const userSchema = new schema({
  profileImage: { type: String, default: "Default Image" },
  name: { type: String, required: false },
  role :{ type:String, enum:["Admin","User"],required:false},
  Dob: { type: Date, required: false },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false ,select : false},
  phone: { type: String, min: 10, max: 10, default: null },
  isDelete :{type:Boolean , default : false},
},{ timestamps: true });

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next()
  this.password= await bcrypt.hash(this.password ,12)
  next()
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
  //console.log(candidatePassword,userPassword)   
   return  bcrypt.compare(candidatePassword,userPassword)
};

const user = mongoose.model("Users", userSchema);
module.exports.user = user;
