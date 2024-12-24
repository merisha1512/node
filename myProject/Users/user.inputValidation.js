const joi = require("joi");
const mongoose = require("mongoose");
const AppError = require("../Errors/AppError");

//user id input validation;
const userInputParamsValidation = (req,res,next) =>{
    const chkValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!chkValidId) return next( new AppError("This id is Not Found or Invalid Id",404));
    next();
};

// create joi validation

const createUserInputValidation = (req,res,next)=>{
    const schema = joi.object({
        profileImage : joi.string(),
        name : joi.string().required(),
        role:joi.string().valid("Admin", "User").required(),
        Dob : joi.date().required(),
        gender : joi.string().valid("Male", "Female", "Other").required(),
        email : joi.string().email().required(),
        password: joi.string().min(8).max(20).required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        phone : joi.string().min(10).max(10).required(),
        isDelete: joi.boolean().required(),
        
    });
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
    next();

};

const updateUserInputValidation = (req,res,next)=>{

    const schema = joi.object({
        profileImage : joi.string().required(),
        firstName : joi.string().required(),
        lastName : joi.string().required(),
        Dob : joi.date().required(),
        gender : joi.string().valid("Male", "Female", "Other").required(),
        email : joi.string().email().required(),
        password: joi.string().min(8).max(20).required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        phone : joi.string().min(10).max(10).required(),
    });
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
  
    next();
};
module.exports = {

    userInputParamsValidation,
    createUserInputValidation,
    updateUserInputValidation,
};