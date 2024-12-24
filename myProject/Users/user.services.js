const repository = require("./user.repository");
const { user } = require("./user.model");

const getAllUser = async (req,res)=>{
    try{
        const User = await repository.findAllUsers()
        res.status(200).send(User);
    }catch(error){
      console.log(error);
     return res.status(500).send(error);
    }
};

const getUserById = async(req,res)=> {
    const id = req.params.id
    try{
const User = await repository.findUserById(id);
     if(User){
        res.status(200).send(User);
     }else{
        res.status(404).send("Data Not Found");
     }
    }catch(error){
      console.log(error);
      return res.status(500).send(error);
    }
};

const create = async(req,res)=>{
    try{
  const newUser = new user({
    profileImage  :req.body.profileImage,
    name : req.body.name,
    role : req.body.role,
    Dob : req.body.Dob,
    gender : req.body.gender,
    email : req.body.email,
    password : req.body.password,
    phone : req.body.phone,

  });
   const saveUser = await repository.createUser(newUser);
   console.log(saveUser);
   if (saveUser) {
    console.log("User saved successfully");
    return res.status(201).send(saveUser);
  } else {
    console.log("User not saved");
    return res.status(400).send("Error saving User");
  }
}catch(error){
      console.log(error);
      return  res.status(500).send(error);
    }
};

const updateUser = async(req,res) =>{
    const id = req.params.id;
    try{
        const User = await repository.findUserById(id);
        if(User){
            const updateUser ={
                profileImage  :req.body.profileImage,
                name : req.body.name,
                Dob : req.body.Dob,
                gender : req.body.gender,
                phone : req.body.phone,
                
            }
            await repository.update(id, updateUser);
            const User = await repository.findUserById(id);
          return res.status(200).send(User);
        }
        res.status(404).send("Data Not found");

    }catch(error){
      console.log(error);
      return res.status(500).send(error);
    }
};

const deleteUser = async(req,res) =>{
    const id = req.params.id;
    try{
        const User = await repository.findUserById(id);
        if(User){
        await repository.removeUser(id);
        return res.status(200).send("DELETED");
    }
    }catch(error){
      console.log(error);
      return   res.status(500).send(error);
    }
};

module.exports={
    getAllUser, getUserById,
    create, updateUser,
    deleteUser
};