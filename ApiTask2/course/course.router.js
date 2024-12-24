const express = require('express');
const router = express.Router();
const courseController = require('./course.service');
const validate = require('./course.middleware')

router.get("/",courseController.getAllCourse);
router.get("/:id",validate.inputParamsValidation,courseController.getCourseById );
router.post("/",validate.createCourseValidation,courseController.createCourse);
router.put("/:id",validate.inputParamsValidation,validate.updateCourseValidation,courseController.updateCourseById,);
router.patch("/:id",validate.inputParamsValidation,validate.updateNameValidation,courseController.patchCourseById,);
router.delete("/:id",validate.inputParamsValidation,courseController.deleteById, );

module.exports = router
