const express = require("express");
const router = express.Router();
const service = require("./movie.services"); // import service file
const inputValidation = require("./movie.inputValidation"); // import inputValidation file
const AppError = require("../Errors/AppError"); //class
const globalErrorController = require("../Errors/errorController");
const {
  userAuthVerification,
  userRollVerification,
  user_adminVerification,
} = require("../Middleware/auth.middleware");

// get all  movies
router.get(
  "/",
  userAuthVerification,
  user_adminVerification,
  service.getAllMovie
);

// create movie
router.post(
  "/",
  userAuthVerification,
  userRollVerification,
  inputValidation.createMovieInputValidation,
  service.createMovie
);

// get movie by id
router.get(
  "/:id",
  userAuthVerification,
  user_adminVerification,
  inputValidation.inputParamsValidation,
  service.getMovieById
);

// update movie by id
router.put(
  "/:id",
  userAuthVerification,
  userRollVerification,
  inputValidation.inputParamsValidation,
  inputValidation.updateMovieInputValidation,
  service.updateMovieById
);

// update language by id
router.patch(
  "/languages/:id",
  userAuthVerification,
  userRollVerification,
  inputValidation.inputParamsValidation,
  inputValidation.updateLanguageInputValidation,
  service.updateLanguageById
);

// update cast by id
router.patch(
  "/cast/:id",
  userAuthVerification,
  userRollVerification,
  inputValidation.inputCastIdValidation,
  inputValidation.updateCastInputValidation,
  service.updateCastById
);

// update release date by id
router.patch(
  "/releaseDate/:id/",
  userAuthVerification,
  userRollVerification,
  inputValidation.inputParamsValidation,
  inputValidation.updateReleaseDateInputValidation,
  service.updateReleaseDateById
);

// delete movie by id
router.delete(
  "/:id",
  userAuthVerification,
  userRollVerification,
  inputValidation.inputParamsValidation,
  service.deleteMovieById
);

router.use(globalErrorController);
//if the user give rout is not valid. this rout will activate
router.all("*", (req, res, next) => {
  // stage -1
  // res.status(400).json({
  //   status: "failed",
  //   message: `can't find ${req.originalUrl} in the server`,
  // });

  //stage -2
  //   const err = new Error(`can't find ${req.originalUrl} in the server`);
  //   err.statusCode = 404;
  // err.status = "failed";
  //next(err);

  //stage-3
  next(new AppError(`can't find ${req.originalUrl} in the server`, 404));
});

module.exports = router;
