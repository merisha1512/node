const express = require("express");
const authenticationRouter = express.Router();
const AppError = require("../Errors/AppError");
const globalErrorController = require("../Errors/errorController");
const controller = require("./auth.controller");

authenticationRouter.post("/login",controller.loginControl );

authenticationRouter.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} in the server`, 404));
});
authenticationRouter.use(globalErrorController);

module.exports = authenticationRouter;
