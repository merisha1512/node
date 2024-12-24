const joi = require("joi");

const createCourseValidation = (req, res, next) => {
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


  
  const updateCourseValidation = (req,res,next)=>{
   
    const schema =joi.object({
      code: joi.string().min(4).required(),
      name: joi.string().min(4).required()
    });
    const input = schema.validate(req.body);
    if(input.error){
      return res.status(400).send(input.error.details[0].message);
    }
    
   next()
  };
  


  const updateNameValidation = (req,res,next)=>{
    const schema = joi.object({
      name: joi.string().min(4).required()
    })
    const input = schema.validate(req.body);
    if(input.error){
      return res.status(400).send(input.error.details[0].message);
    }
    next();

  }

   const inputParamsValidation = (req,res,next)=>{
    const paramSchema =joi.object({
      id : joi. string().required()
    });
    const validateParams = paramSchema.validate(req.params);
    if(validateParams.error){
      return res.status(400).send(validateParams.error.details[0].message);
    }
    next();
  }

  module.exports = {createCourseValidation, updateCourseValidation,
                      updateNameValidation, inputParamsValidation} 