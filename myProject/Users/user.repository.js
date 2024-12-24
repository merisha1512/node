const mongoose = require("mongoose");
const { user } = require("./user.model");

// find all users

const findAllUsers = async()=>{
    return await user.find();
};

const findUserById = async(id)=>{
    return await user.findOne({_id: new mongoose.Types.ObjectId(id)});
};

const createUser = async(newUser)=>{
return await newUser.save();
};

const update = async(id, updateUser)=>{
return await user.findOneAndUpdate({_id:id}, updateUser);
};

const removeUser = async(id)=>{
    return await user.deleteOne({_id:id});
};

module.exports = {
    findAllUsers, findUserById,
    createUser, update,
    removeUser
}


