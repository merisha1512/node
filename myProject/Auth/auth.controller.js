const service = require("./auth.services");
const inputValidation = require("./auth.inputValidation");
const loginControl = async(req,res,next)=>{
    try {
        const  login = await service.userLogin(req,res);
        res.status(200).send(login)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message);
    }

};

module.exports={loginControl}
