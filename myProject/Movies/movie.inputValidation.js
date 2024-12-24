const joi = require("joi");
const mongoose = require("mongoose");
const AppError = require('../Errors/AppError')

// movie id validation
const inputParamsValidation = (req, res, next) => {
  const chkValidId = mongoose.Types.ObjectId.isValid(req.params.id);
  //if (!chkValidId) return res.status(404).send(" Id Notfound");
  if (!chkValidId) return next( new AppError("This id is Not Found or Invalid Id",404));
 
  next();
};

// cast id validation
 const inputCastIdValidation = (req,res,next)=>{
  const checkValidCastId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!checkValidCastId) return next( new AppError("This id is Not Found or Invalid Id",404));
 
  next();
}

 // movie create validation
  const createMovieInputValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().required(),
    code: joi.string().min(4).max(4).required(),
    category: joi
      .string()
      .valid("ACTION", "COMEDY", "ROMANCE", "THRILLER", "DRAMA", "HORROR")
      .required(),
    languages: joi
      .array()
      .items(
        joi.string().valid("ENGLISH", "TAMIL", "MALAYALAM", "KANNADA", "TELUGU")
      )
      .min(1)
      .max(5)
      .required(),
    duration: joi
      .string()
      .regex(/^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$/)
      .required(),

    cast: joi.array().items(
      joi.object().keys({
        pic: joi.string(),
        name: joi.string(),
       age:joi.number(),
      }),
    ),

    poster: joi.string().required(),
    description: joi.string().min(20).max(100).required(),
    releaseDate: joi.date().required(),
  });
  const input = schema.validate(req.body);

  if (input.error) return res.status(400).send(input.error.details[0].message);

  next();
};

//movie update validation
const updateMovieInputValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().required(),
    code: joi.string().min(4).max(4).required(),
    category: joi
      .string()
      .valid("ACTION", "COMEDY", "ROMANCE", "THRILLER", "DRAMA", "HORROR")
      .required(),
    languages: joi
      .array()
      .items(
        joi.string().valid("ENGLISH", "TAMIL", "MALAYALAM", "KANNADA", "TELUGU")
      )
      .min(1)
      .max(5)
      .required(),
    duration: joi
      .string()
      .regex(/^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$/)
      .required(),
    cast: joi.array().items(
      joi.object().keys({
        pic: joi.string(),
        name: joi.string(),
      age: joi.number(),
      })
    ),
    poster: joi.string().required(),
    description: joi.string().min(20).max(100).required(),
    releaseDate: joi.date().required(),
  });
  const input = schema.validate(req.body);

  if (input.error)  return res.status(400).send(input.error.details[0].message);
  next();
};

// language update validation

const updateLanguageInputValidation = (req, res, next) => {
  const schema = joi.object({
    languages: joi
      .array()
      .items(
        joi.string().valid("ENGLISH", "TAMIL", "MALAYALAM", "KANNADA", "TELUGU")
      )
      .min(1)
      .max(5)
      .required(),
  });
  const input = schema.validate(req.body);
  if (input.error) 
    return res.status(400).send(input.error.details[0].message);

  next();
};

//cast update validation
const updateCastInputValidation = (req, res, next) => {
  const schema = joi.object({
    cast: joi.array().items(
      joi.object().keys({
        pic: joi.string(),
        name: joi.string(),
        age: joi.number(),
      })
    ),
  });
  const input = schema.validate(req.body);
  if (input.error)  return res.status(400).send(input.error.details[0].message);

  next();
};

//releaseDate update validation

const updateReleaseDateInputValidation = (req, res, next) => {
  const schema = joi.object({
    releaseDate: joi.date().required(),
  });
  const input = schema.validate(req.body);
  if (input.error) return res.status(400).send(input.error.details[0].message);
  
  next();
};

module.exports = {
  inputParamsValidation,
  inputCastIdValidation,
  createMovieInputValidation,
  updateMovieInputValidation,
  updateLanguageInputValidation,
  updateCastInputValidation,
  updateReleaseDateInputValidation,
};
