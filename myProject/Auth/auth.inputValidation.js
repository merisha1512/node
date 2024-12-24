const joi = require('joi');

const userLogin =  (req,res,next)=>{
    const schema = joi.object({
        email : joi.string().email().required(),
        password: joi.string().min(8).max(20).required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    });
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
    next();
};

const forgotPassword =(req,res,next)=>{
    const schema = joi.object({
        email : joi.string().email().required(),
    })
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
    next();

}

const resetPasswordOTP =(req,res,next)=>{
    const schema = joi.object({
        email : joi.string().email().required(),
        OTP:joi.string().required(),
        userNewPassword:joi.string().min(8).max(20).required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
    })
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
    next();
}

const changePassword =(req,res,next)=>{
    const schema = joi.object({
        email : joi.string().email().required(),
        OldPassword:joi.string().min(8).max(20).required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        newPassword:joi.string().min(8).max(20).required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),

    })
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
    next();
}

const necessaryDetails = (req,res,next)=>{
    const schema =joi.object({
        DOB: joi.date().required(),
        gender: joi.string().valid("Male", "Female", "Other").required(),
        password: joi.string().min(8).max(20).required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        phone: joi.string().min(10).max(10).required(),

    })
    const input = schema.validate(req.body);

    if (input.error) return res.status(400).send(input.error.details[0].message);
    next();

}
module.exports ={userLogin, forgotPassword, 
    resetPasswordOTP, changePassword, necessaryDetails}
