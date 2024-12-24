const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const userLoginValidation = require("./inputValidation");
const AppError = require("../Errors/AppError");
const globalErrorController = require("../Errors/errorController");
const { user } = require("../Users/user.model");
const { token } = require("./auth.token.model");
const repository = require("./auth.repository");
const nodeMailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const uuid =require("uuid");
const bcrypt = require("bcryptjs");
const otpGenerate = require("otplib");
const { ObjectId } = require("mongodb");


//login
const login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await user.findOne({ email: email }).select("+password"); //find the user
    if (!userEmail)
      return next(new AppError(`${email} is not a valid email* please provide the valid Email `,401)); //email

    const userPassword = await new user().correctPassword( password,userEmail.password); // check the password
    if (!userPassword)
    return next(new AppError`${password} is a invalid password..please provide the valid  password`,401 ); //password

    if (userEmail && userPassword) {

      let access =  new ObjectId();
      let refresh = new ObjectId();

      const accessToken = jwt.sign( { id: userEmail._id, type:"accessToken"},process.env.JWT_SECRET,
                                    { expiresIn: process.env.JWT_EXPIRES_IN });

      const refreshToken = jwt.sign({ id: userEmail._id, type:"refreshToken"},process.env.JWT_SECRET,
                           { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN });

      // saving the data  
      const newAccessToken = new token({
        _id:access,
       reference:refresh,
        token: accessToken,
        type:"accessToken" 
        });
      const saveToken = await repository.createToken(newAccessToken);

      const newRefreshToken = new token({
        _id:refresh,
        reference:access,
        token : refreshToken,
        type:"refreshToken" 
        });
     const saveRefreshToken= await repository.createToken( newRefreshToken);
      return res .status(200)
        .setHeader("Access", accessToken).setHeader("refresh", refreshToken)
        .json({
          message: "login successfully",
          accessToken,
          refreshToken,
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

// refresh token
const refreshToken = async (req, res, next) => {
  try {
    const RefreshToken = req.headers.refresh;
    if (!RefreshToken)
      return next(new AppError("refresh token is required", 401));

    const checkRefreshTokenExist = await repository.isRefreshTokenExist(RefreshToken);
    if (!checkRefreshTokenExist) 
        return next(new AppError(" not a existing refreshToken in the DB ", 401));
   const refreshTokenDetails = checkRefreshTokenExist.reference ;
  
    const decodedRefreshToken = jwt.verify(RefreshToken,process.env.JWT_SECRET);
    //await promisify(jwt.verify)(refreshToken, process.env.JWT_SECRET);
    const userId = decodedRefreshToken.id;
  
    const User = await user.findById({ _id: userId });
    if (!User) return next(new AppError(`user id ${userId} not found`, 404));

    if (User && checkRefreshTokenExist && RefreshToken) {

      await repository.deleteToken(refreshTokenDetails);

      const accessToken = jwt.sign({ id: User._id,type:"accessToken" }, process.env.JWT_SECRET,
                                   {expiresIn: process.env.JWT_EXPIRES_IN,});
      const refreshToken = jwt.sign({ id: User._id,type:"refreshToken" }, process.env.JWT_SECRET, 
                                    {expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,});
     let access =  new ObjectId();
     let refresh = new ObjectId();

     const newAccessToken = new token({
      _id:access,
     reference:refresh,
      token: accessToken,
      type:"accessToken" 
      });
    const saveToken = await repository.createToken(newAccessToken);

    const newRefreshToken = new token({
      _id:refresh,
      reference:access,
      token : refreshToken,
      type:"refreshToken" 
      });
   const saveRefreshToken= await repository.createToken( newRefreshToken); 
      return res.status(200)
        .setHeader("Access", accessToken)
        .setHeader("refresh", refreshToken)
        .json({
          message: "Refreshing the Token",
          accessToken,
          refreshToken,
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

// logOut router
const logout = async (req, res, next) => {
  try {
    let Token;
    if (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))

      Token = req.headers.authorization.split(" ")[1];
    if (!Token) return next(new AppError("you must login", 401));

    // verify the access Token it's there in the db
    const checkTokenExist = await repository.isAccessTokenExist(Token);
    if (!checkTokenExist)
      return next(new AppError(" not a existing access token in the DB ", 401));
     
      const  accessTokenDetails = checkTokenExist._id;
    const decodedToken = jwt.verify(Token,process.env.JWT_SECRET);
    const userId =decodedToken.id;
    const User = await user.findById({ _id: userId });
    if (!User)
    return next(new AppError(" not a existing access token in the DB ", 401));

      await repository.deleteToken(accessTokenDetails);
      
    return res.status(200).send("logout");
    
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

// forgot password with Token
const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const userEmail = await user.findOne({ email: email });
    if (!userEmail)
      return next(new AppError(`${email} is not a valid email* please provide the valid Email `,404));
//name
    const username = userEmail.name;
//token
    const Token = jwt.sign({ id: userEmail._id ,type:"resetPasswordToken" }, process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN,});
// node mailer
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

// save DB
const resetPasswordToken = new token({
  token:Token,
  type:"resetPasswordToken" 
  });
const saveToken = await repository.createToken(resetPasswordToken);

// html template source
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, "/template.Token.hbs"),"utf8");

//HBS
    const template = handlebars.compile(emailTemplateSource);
    const htmlToSend = template({ name: username, token: Token });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error);
      console.log(info.envelope);
    });
    res.status(200).json({
      message: " the reset password  token is sent",
      Token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

// forgot password with OTP

const forgotPasswordOTP = async (req, res, next) => {
  try {
    const email = req.body.email;
    const userEmail = await user.findOne({ email: email });
    if (!userEmail)
      return next(new AppError(`${email} is not a valid email* please provide the valid Email `,404));

//name
    const username = userEmail.name;

// node mailer
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    });
// otp generate
    const secret = process.env.OTP_SECRET 
    
    const  OTP = otpGenerate.authenticator.generate(secret);
    
    // const isValid =  otpGenerate.authenticator.check(OTP,modSecret)
    // console.log(isValid)
    // if (!isValid) return next(new AppError(` not a valid otp`));

// html template source
    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, "/template.Otp.hbs"),"utf8");
//HBS
    const template = handlebars.compile(emailTemplateSource);
    const htmlToSend = template({ name: username, OTP: OTP });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error);
      console.log(info.envelope);
    });
    res.status(200).json({
      message: " the reset password  OTP is sent",
      OTP,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

// reset password with token

const resetPasswordToken = async (req, res, next) => {
  try {
    const ResetPasswordToken = req.query.token;
    if (!ResetPasswordToken)
      return next(new AppError(` reset token is required`, 404));

    const checkResetPasswordTokenExist =
      await repository.isResetPasswordTokenExist(ResetPasswordToken);
    if (!checkResetPasswordTokenExist) 
      return next(new AppError(" not a existing ResetPasswordToken in the DB ", 401));
    
    const decodedResetPasswordToken = jwt.verify(ResetPasswordToken,process.env.JWT_SECRET);
    const userId = decodedResetPasswordToken.id;

    const User = await user.findById({ _id: userId });
    if (!User) return next(new AppError(`user with id ${userId} not found`));
    console.log(User);
    if (ResetPasswordToken && checkResetPasswordTokenExist && User) {
      const userNewPassword = req.body.password;
      const hashedPassword = await bcrypt.hash(userNewPassword, 12);
      await user.findOneAndUpdate({ _id: User._id },{ password: hashedPassword }); 
      }
    await token.deleteOne({token:ResetPasswordToken})

// New tokens generate   
 const accessToken = jwt.sign({ id: User._id,type:"accessToken" }, process.env.JWT_SECRET,
                              {expiresIn: process.env.JWT_EXPIRES_IN,});
 const refreshToken = jwt.sign({ id: User._id,type:"refreshToken" }, process.env.JWT_SECRET, 
                {expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,});


                let access =  new ObjectId();
                let refresh = new ObjectId();
           
                const newAccessToken = new token({
                 _id:access,
                reference:refresh,
                 token: accessToken,
                 type:"accessToken" 
                 });
               const saveToken = await repository.createToken(newAccessToken);
           
               const newRefreshToken = new token({
                 _id:refresh,
                 reference:access,
                 token : refreshToken,
                 type:"refreshToken" 
                 });
              const saveRefreshToken= await repository.createToken( newRefreshToken);

return res.status(200)
  .setHeader("Access", accessToken)
  .setHeader("refresh", refreshToken)
  .json({
    message: " New Tokens after reset the password",
    accessToken,
    refreshToken,
  });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

// reset password with OTP

const resetPasswordOTP = async (req, res, next) => {
  try {
    const ResetPasswordOTP = req.body.OTP;
    const email = req.body.email;
    const secret  =process.env.OTP_SECRET
   
    if (!ResetPasswordOTP)
      return next(new AppError(` reset Password OTP is required`, 404));

    const isValid =  otpGenerate.authenticator.check(ResetPasswordOTP,secret)
    if (!isValid) return next(new AppError(` not a valid otp or secret`));

    const User = await user.findOne({ email: email });
    if (!User) return next(new AppError(`user  not found`));
    console.log(User.email);

    const userNewPassword = req.body.userNewPassword;
    console.log(userNewPassword);
    const hashedPassword = await bcrypt.hash(userNewPassword, 12);
    console.log(hashedPassword);
    await user.findOneAndUpdate({ _id: User.user_id },{ password: userNewPassword });

    // New tokens generate   
    const accessToken = jwt.sign({ id: User._id,type:"accessToken"  }, process.env.JWT_SECRET, 
                                 {expiresIn: process.env.JWT_EXPIRES_IN, });
    const refreshToken = jwt.sign({ id: User._id,type:"refreshToken"  }, process.env.JWT_SECRET,
                    {expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,});
   
                    let access =  new ObjectId();
                    let refresh = new ObjectId();
               
                    const newAccessToken = new token({
                     _id:access,
                    reference:refresh,
                     token: accessToken,
                     type:"accessToken" 
                     });
                   const saveToken = await repository.createToken(newAccessToken);
               
                   const newRefreshToken = new token({
                     _id:refresh,
                     reference:access,
                     token : refreshToken,
                     type:"refreshToken" 
                     });
                  const saveRefreshToken= await repository.createToken( newRefreshToken);

   return res.status(200)
  .setHeader("Access", accessToken)
  .setHeader("refresh", refreshToken)
  .json({
    message: " New Tokens after reset the password",
    accessToken,
    refreshToken,
  });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

const passwordChange = async(req,res,next)=> {
try {
  let Token;
    if (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))

      Token = req.headers.authorization.split(" ")[1];
    if (!Token) return next(new AppError("you must login", 401));

    // verify the access Token it's there in the db
    const checkTokenExist = await repository.isAccessTokenExist(Token);
    if (!checkTokenExist)
      return next(new AppError(" not a existing access token in the DB ", 401));

if(Token && checkTokenExist){

  const email = req.body.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  
  const checkOldPassword = await repository. isEmailIsExists(email);
  
  const compare = await  bcrypt.compare(oldPassword,checkOldPassword.password);
  
  if(!checkOldPassword && !compare )
  return next(new AppError(" not a existing Old Password ", 401));
 
 const userNewPassword = await bcrypt.hash(newPassword,12)
  await repository.passwordChange(checkOldPassword.email,userNewPassword);
  return  res.status(200).send("passwordChanged")

}  
} catch (error) {
  console.log(error);
  return res.status(500).send(error.message);
}
};

// create Invitation
const invitation = async(req,res,next)=>{
  try{
  const email = req.body.email;
  const name = req.body.name;
  const role = req.body.role;

  const newUser = new user({
    email,
    name,
    role,
  });
   
  await repository.createUser(newUser)
    
  const username =  newUser.name;
  const inviteToken = jwt.sign({email:email,role:role,name:name,type:"invitationToken"},process.env.JWT_INVITE_SECRET,
                               {expiresIn:process.env.JWT_INVITE_EXPIRES_IN});
  
  const invitationToken = new token({
   user: newUser._id,
  token: inviteToken,
   type:"invitationToken" ,
   expiresAt:new Date(Date.now() + 600)
 });
  const saveToken = await repository.createToken(invitationToken);

// node mailer
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  }
});
// html template source
const emailTemplateSource = fs.readFileSync(
  path.join(__dirname, "/template.invite.hbs"),"utf8");

//HBS
const template = handlebars.compile(emailTemplateSource);
const htmlToSend = template({ name: username, token: inviteToken });
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Invitation",
  html: htmlToSend,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) console.log(error);
  console.log(info.envelope);
});
 return res.status(200).setHeader("invite",inviteToken).json({
  message: "invitation created",
  inviteToken
});                           
  }
  catch(error){
    console.log(error);
  return res.status(500).send(error.message);

  }
};

const createUserOrAdmin =async(req,res,next)=>{
  try {
    
    const inviteToken = req.query.token;
    if (!inviteToken)
      return next(new AppError(` invite token is required`, 404));

    const checkInviteTokenExist =
      await repository.isInvitationTokenExist(inviteToken);
    if (!checkInviteTokenExist) 
      return next(new AppError(" not a existing Invite Token in the DB ", 401));
    
    const decodedInviteToken = jwt.verify(inviteToken,process.env.JWT_INVITE_SECRET);
    const userEmail = decodedInviteToken.email;
   
     const password =req.body.password 
     const passwordHash = await bcrypt.hash(password,12)

      const newUser = {
        profileImage  :req.body.profileImage,
        name : req.body.name,
        Dob : req.body.Dob,
        gender : req.body.gender,
        password : passwordHash,
        phone : req.body.phone,
    
      };
       const saveUser = await repository.updateUser(userEmail,newUser);
      
       await token.deleteOne({token:inviteToken})

    return res.status(200).send("Account Created")
    
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }

};

authRouter.post("/login", userLoginValidation.userLogin, login);
authRouter.post("/refresh", refreshToken);
authRouter.delete("/logout", logout);
authRouter.post("/forgotPassword",userLoginValidation.forgotPassword, forgotPassword);
authRouter.post("/forgotPasswordOTP",userLoginValidation.forgotPassword, forgotPasswordOTP);
authRouter.patch("/resetPasswordToken", resetPasswordToken);
authRouter.patch("/resetPasswordOTP",userLoginValidation.resetPasswordOTP, resetPasswordOTP);
authRouter.patch("/passwordChange",userLoginValidation.changePassword,passwordChange);
authRouter.post("/invitation",invitation);
authRouter.put("/createUserOrAdmin",userLoginValidation.necessaryDetails,createUserOrAdmin )
authRouter.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} in the server`, 404));
});
authRouter.use(globalErrorController);

module.exports = authRouter;
