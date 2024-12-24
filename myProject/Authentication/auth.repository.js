const mongoose = require("mongoose");
const { token } = require("./auth.token.model");
const { user } = require("../Users/user.model");

const createToken = async(newToken) => {
   console.log(newToken);
   return await newToken.save();
};

const updateAccessToken = async (type, id,newTokens)=>{
  
   return await token.findOneAndUpdate({type:type,_id:id},newTokens )
         };

const updateRefreshToken = async (type,id,newTokens)=>{

   return await token.findOneAndUpdate({type:type,reference:id}, newTokens )
  };
    
const  isAccessTokenExist = async(Token) => {
    return await token.findOne({token:Token})
   
         };


 const  isRefreshTokenExist = async(RefreshToken)=>{
    return await token.findOne({token:RefreshToken})
   
 };

 
 const isInvitationTokenExist = async (invitationToken)=>{
   const checkToken = await token.findOne({token:invitationToken})
   if(checkToken) return true
        else  return false 
 };

 const isResetPasswordTokenExist = async (resetPasswordToken)=>{
   const checkToken = await token.findOne({token:resetPasswordToken})
   if(checkToken) return true
        else  return false 
 };



   const passwordChange = async (email,newPassword)=>{
return await user.findOneAndUpdate( {email:email},{password:newPassword} )
   }

   const isEmailIsExists = async (email)=>{
 return await user.findOne({email:email}).select("+password");

   }

const createUser = async(newUser) => {return await newUser.save();};  

const updateUser = async (email, newUser) =>{
   return await user.findOneAndUpdate( {email:email},newUser)
}

const deleteToken = async (id)=>{
   //return await token.deleteMany({$and:[{user:id},{$or:[{type:"accessToken"},{type:"refreshToken"}]}]})
   return await token.deleteMany({$or:[{_id:id,},{reference:id}]})
 };

module.exports ={ createToken ,updateAccessToken,
                updateRefreshToken, deleteToken, isAccessTokenExist , isRefreshTokenExist, isResetPasswordTokenExist,
                passwordChange, isEmailIsExists,
               createUser , isInvitationTokenExist ,updateUser} 