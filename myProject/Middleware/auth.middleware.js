const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { user } = require("../Users/user.model");
const AppError = require("../Errors/AppError");
const repository = require("../Authentication/auth.repository");

exports.userAuthVerification = async (req, res, next) => {
  try {
    // get the token and check of it's there or not ...
    let Token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      Token = req.headers.authorization.split(" ")[1];
    if (!Token) return next(new AppError("you must login", 401));

    // verify the access Token it's there in the db
    const checkTokenExist = await repository.isAccessTokenExist(Token);
    if (!checkTokenExist)
      return next(new AppError(" not a existing access token in the DB ", 401));

    // verify the Token and it's valid or not
    let decoded = await promisify(jwt.verify)(Token, process.env.JWT_SECRET);

    // check the user is exist or not
    const currentUser = await user.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError(" not a existing user", 401));
    }
    next();
  } catch (error) {
    console.log(error.message);
    return next(new AppError("please login again", 401));
  }
};

exports.userRollVerification = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new AppError("you must login", 401));

    const checkTokenExist = await repository.isAccessTokenExist(token);
    if (!checkTokenExist)
      return next(new AppError(" not a existing access token in the DB ", 401));

    const decodeAccessToken = jwt.verify(token, process.env.JWT_SECRET);

    const existingUser = await user.findById(decodeAccessToken.id);
    if (existingUser.role !== "Admin") {
      return next(new AppError(" Admin can access only the page ", 401));
    }
    console.log(" now u can access the page");
    next();
  } catch (error) {
    console.log(error.message);
    return next(
      new AppError("please login again ,  userRollVerification ", 401)
    );
  }
};

exports.user_adminVerification = async (req,res,next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new AppError("you must login", 401));

    const checkTokenExist = await repository.isAccessTokenExist(token);
    if (!checkTokenExist)
      return next(new AppError(" not a existing access token in the DB ", 401));

    const decodeAccessToken = jwt.verify(token, process.env.JWT_SECRET);

    const existingUser_Admin = await user.findById(decodeAccessToken.id);
    if (["Admin", "User"].includes(existingUser_Admin.role)) {
     return next();
    }
    return next(new AppError(" not a existing User or admin ", 401));
  } catch (error) {
    console.log(error.message);
    return next(
      new AppError("please login again , user_adminVerification   ", 401)
    );
  }
};
