const { cast } = require("./cast.model");
const { category} = require("./category.model");
const { movie } = require("./movie.model");
const mongoose = require("mongoose");

// find all the movie
const findAllMovie = async () => {
  return await movie.find().populate("category");
};

//find movie using ID
const findMovieById = async (id) => {
  return await movie.findOne({ _id: new mongoose.Types.ObjectId(id) }).populate("category");
};

// find cast using by id 
const findCastById = async(id)=>{
  return await cast.findOne({_id:new mongoose.Types.ObjectId(id)})
};

// create category
const categoryCreate = async (cateCreate)=>{
  return await new category({category:cateCreate}).save();
}

// create cast
const castCreate = async (cst) =>{
return await  cast.create(cst);
}

//create New movie
const create = async (newMovie) => {
  console.log(newMovie)
  return await newMovie.save();
};

// check the code is exist or not
const isCodeExist = async (code) => {
 const Movie  = await movie.findOne({ code: code });
 if(Movie) return true
 return false
};

// check the category is exist or not
const isCategoryExist = async (cate)=>{
  const movieCategory  = await category.findOne({category:cate});
  if(movieCategory) return true;
  return false;
}

// update the movie
const update = async (id, updateMovie) => {
  return await movie.findOneAndUpdate({ _id: id }, updateMovie);
};

// update language by id
const languageUpdate = async(id, patchData)=>{
 return await movie.updateOne({ _id: id },{$set:{languages:patchData}});
};

// update cast by id
const  castUpdate = async(id,castPatchData)=>{
  return  await cast.findOneAndUpdate({ _id: id },{$set:{cast:castPatchData}},{new:true});

}

// update release date by id
const releaseDateUpdate = async( id, patchData)=>{
  return await  movie.updateOne({ _id: id },{$set:{releaseDate:patchData}});
}

// delete movie by id
const remove = async (id) => {
  return await movie.deleteOne({ _id: id });
};

module.exports = {
  findAllMovie, findMovieById, findCastById,
  create,
  update, languageUpdate, castUpdate, releaseDateUpdate,
  remove,
  isCodeExist, isCategoryExist ,
  categoryCreate, castCreate
};
