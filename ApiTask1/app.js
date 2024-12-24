const express = require('express');
const app = express();
const joi = require('joi');
const mongoose = require("mongoose")
app.use(express.json());

// connection 
mongoose.connect("mongodb+srv://Akash:05121998@cluster0.b9jwp.mongodb.net/courses?retryWrites=true&w=majority",
{useNewUrlParser : true , useUnifiedTopology : true})
.then(() => console.log("Connected To Database"))

// DB schema
const courseSchema = new mongoose.Schema({
    code: {type:String},
    name: {type:String},
})
const  courseModel = mongoose.model("courseCollection",courseSchema)



// Middleware
const validateBody = (req, res, next) => {
  const schema = joi.object({
    code: joi.string().min(4).required(),
    name: joi.string().min(2).required(),
  });
  const input = schema.validate(req.body);

  if (input.error) {
    return res.status(400).send(input.error.details[0].message);
  }
  next();
};


// GET
const getData = async (req, res) => {

  const courses = await courseModel.find();

  res.status(200).send(courses);
};

// GET DATA BY ID
const getDataById = async (req, res) => {

  const id = req.params.id ;

  const course = await courseModel.findOne({ _id: new mongoose.Types.ObjectId(id)});

  if (!course) res.status(404).send("Course not found");

  else  res.status(200).send(course);
  
};

// POST
const postData = async (req, res) => {

  const newCourse = new courseModel({
    code: req.body.code,
    name: req.body.name,  
  });

  const course = await newCourse.save();

  if (course) {
    console.log("Course saved successfully");
    res.status(201).send(course);
  } else {
    console.log("Course not saved");
    res.status(400).send("Error saving course");
  }
};

// PUT
const putDataById = async (req, res) => { 

  const id = req.params.id ;
  const course = await courseModel.findOne({  _id: new mongoose.Types.ObjectId(id)});

  if (!course) res.status(404).send("Course not found");
  else {
    const courseData = {
      code: req.body.code,
      name: req.body.name,
    };
  await courseModel.updateOne({ _id: id }, courseData);
  const updatedCourse = await courseModel.findOne({  _id: new mongoose.Types.ObjectId(id)});
  res.status(200).send(updatedCourse);
  }
};

// PATCH
const patchDataById = async (req, res) => {

  const id = req.params.id;
  let course = await courseModel.findOne({ _id: new mongoose.Types.ObjectId(id) });
   
   if(!course)res.status(404).send("Course not found");
    
  const patchData = req.body;
  
  const updatedCourse = Object.assign( course, patchData);
 
  const updateOneResult = await courseModel.findOneAndUpdate({ _id: id }, { $set: updatedCourse });
  
    if (updateOneResult) {
      res.status(200).send(updatedCourse);
    } else {
      res.status(404).send("Course not found");
    }
};

//Delate
const deleteDataById = async (req, res) => {

  const id = req.params.id;
  const course = await courseModel.findOne({  _id: new mongoose.Types.ObjectId(id) });

  if (!course)  res.status(404).send("Course not found");

   else {
    await courseModel.deleteOne({ _id: id });
    res.status(200).send("Course deleted");
  }
};

//routers
 app.get('/api/courses/', getData)
 app.get('/api/courses/:id', getDataById);
 app.delete('/api/courses/:id', deleteDataById);
 
 app.post('/api/courses/', postData, app.use(validateBody));
 app.put('/api/courses/:id', putDataById, app.use(validateBody))
 app.patch('/api/courses/:id', patchDataById, app.use(validateBody))
 
const port = 6000;
app.listen(port, () => console.log(`Server Start & port:${port}`));
