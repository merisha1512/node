const express = require("express");
const router = express.Router();
const service = require("./user.services");
const inputValidation = require("./user.inputValidation");
const AppError = require("../Errors/AppError");
const globalErrorController = require("../Errors/errorController");

router.get("/", service.getAllUser);
router.get(
  "/:id",
  inputValidation.userInputParamsValidation,
  service.getUserById
);
router.post("/", inputValidation.createUserInputValidation, service.create);
router.put(
  "/:id",
  inputValidation.userInputParamsValidation,
  inputValidation.updateUserInputValidation,
  service.updateUser
);
router.patch("/:id", inputValidation.userInputParamsValidation);
router.delete(
  "/:id",
  inputValidation.userInputParamsValidation,
  service.deleteUser
);
router.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} in the server`, 404));
});
router.use(globalErrorController);
module.exports = router;
