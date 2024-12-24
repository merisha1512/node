const course = require('./course.model');
const repository = require("./course.repository")
 //GET

const getAllCourse = async(req,res) => {
 const course  = await repository.findAllCourse()
    res.status(200).send(course);
};

const getCourseById = async(req,res) => {   
    const id = req.params.id;
    const course= await repository.findCourseById(id)
    if (!course) res.status(404).send("Data not found");
    else  res.status(200).send(course);
};

//POST

const createCourse = async(req,res) =>{
    const newCourse = new course({
        code : req.body.code,
        name : req.body.name
    });
    const saveCourse = await repository.create(newCourse);
    if (saveCourse) {
        console.log("Course saved successfully");
        res.status(201).send(saveCourse);
      } else {
        console.log("Course not saved");
        res.status(400).send("Error saving course");
        }
};

//PUT

const updateCourseById = async(req,res) =>{
   const id= req.params.id;
   const course= await repository.findCourseById(id);
   if(!course) res.status(404).send("Data Not found")

   else {
    const updateCourse ={
    code:req.body.code,
    name:req.body.name
    };
    await repository.update(updateCourse ,id);  
    const course= await repository.findCourseById(id);
    res.status(200).send(course)
        }
};



//PATCH

const patchCourseById = async(req,res)=>{
    const id= req.params.id;
    const course= await repository.findCourseById(id);
if(!course) res.status(404).send("Data Not found")
else {
       const patch =req.body;
       await repository.patched(patch,id);
       const course= await repository.findCourseById(id); 
       res.status(201).send(course);
     }
};

//DELETE

const deleteById = async(req,res)=>{
    const id= req.params.id;
    const course= await repository.findCourseById(id);
    if(!course) res.status(404).send("Data not Found") 
    else await repository.deleted(id)
    res.status(200).send("DELETED")
};

module.exports ={
    getAllCourse,getCourseById,
    createCourse,
    updateCourseById,
    patchCourseById,
    deleteById
}

 