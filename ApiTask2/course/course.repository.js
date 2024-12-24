//const courseController = require('./service.course');
const course = require('./course.model');
const mongoose = require('mongoose');

const findAllCourse = async()=>{
   return await course.find()
};

const findCourseById = async (id)=>{

   return await course.findOne({ _id: new mongoose.Types.ObjectId(id)});
};

const create = async (newCourse) =>{
    return await  newCourse.save();
};


const update = async (updateData,id) => {
return await course.updateOne({_id:id},updateData);
};

const patched = async (patch,id) =>{
   return await course.findOneAndUpdate({ _id: id }, { $set: patch });
};

const deleted = async (id) => {
   return  await course.deleteOne({_id : id})
}


module.exports = {
   findAllCourse,
   findCourseById,
   create,
   update, 
   patched,
   deleted
}