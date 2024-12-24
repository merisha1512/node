const repository= require("./auth.repository");

const userLogin = async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    console.log(email + password);

}
module.exports ={userLogin}
