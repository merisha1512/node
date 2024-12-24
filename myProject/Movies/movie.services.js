const { castSchema } = require("./cast.model");
const { movie } = require("./movie.model");
const repository = require("./movie.repository");
//const catchAsync = require("./errors/catch.async");

//GetAllMovie
const getAllMovie = async (req, res) => {
  try {
    const movies = await repository.findAllMovie();
    res.status(200).send(movies);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

//GetMovieById
const getMovieById = async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await repository.findMovieById(id);
    if (movie) {
      res.status(200).send(movie);
    } else {
      res.status(404).send("Data Not Found");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

// CreateMovie
//const createMovie = catchAsync(async (req, res) => {
const createMovie = async (req, res) => {
  try {
    // create category
    const checkCategoryIsExists = await repository.isCategoryExist(req.body.category);
    if (checkCategoryIsExists)
      return res.status(400).send("Error .. category is already exists");

    // create code
    const checkCodeIsExists = await repository.isCodeExist(req.body.code);
    if (checkCodeIsExists)
      return res.status(400).send(`Error .. code is already exists`);

    const checkCategory = await repository.categoryCreate(req.body.category);
    const checkCast = await repository.castCreate(req.body.cast);

    const newMovie = new movie({
      name: req.body.name,
      code: req.body.code,
      category: checkCategory._id,
      languages: req.body.languages,
      duration: req.body.duration,
      cast: checkCast,
      poster: req.body.poster,
      description: req.body.description,
      releaseDate: req.body.releaseDate,
    });

    const saveMovie = await repository.create(newMovie);
    console.log(saveMovie);
    if (saveMovie) {
      console.log("Movie saved successfully");
      return res.status(201).send(saveMovie);
    } else {
      console.log("Movie not saved");
      return res.status(400).send("Error saving Movie");
    }
  } catch (error) {
    console.log(error);
    return  res.status(500).send(error);
  }
};
//);

//UpdateMovieById
const updateMovieById = async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await repository.findMovieById(id);
    if (movie) {
      const updateMovie = {
        name: req.body.name,
        code: req.body.code,
        category: req.body.category,
        languages: req.body.languages,
        duration: req.body.duration,
        cast: req.body.cast,
        poster: req.body.poster,
        description: req.body.description,
        releaseDate: req.body.releaseDate,
      };
      await repository.update(id, updateMovie);
      const movie = await repository.findMovieById(id);
      return res.status(200).send(movie);
    }
    res.status(404).send("Data Not found");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

//UpdateLanguagesById
const updateLanguageById = async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await repository.findMovieById(id);
    if (movie) {
      const languages = req.body.languages;
      await repository.languageUpdate(id, languages);
      const movie = await repository.findMovieById(id);
      return res.status(200).send(movie);
    }
    res.status(404).send("Data Not found");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

//updateCastById
const updateCastById = async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await repository.findCastById(id);
    if (movie) {
      const cast = req.body.cast;
      await repository.castUpdate(id, cast);
      //const movie = await repository.findCastById(id);
      return res.status(200).send(c);
    }
    res.status(404).send("Data Not found");
  } catch (error) {
    console.log(error);
    return  res.status(500).send(error);
  }
};

//updateReleaseDateById
const updateReleaseDateById = async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await repository.findMovieById(id);
    if (movie) {
      const releaseDate = req.body.releaseDate;
      await repository.releaseDateUpdate(id, releaseDate);
      const movie = await repository.findMovieById(id);
      return res.status(200).send(movie);
    }
    res.status(404).send("Data Not found");
  } catch (error) {
    console.log(error);
    return  res.status(500).send(error);
  }
};
//DeleteMovieById
const deleteMovieById = async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await repository.findMovieById(id);
    if (movie) {
      await repository.remove(id);
      return res.status(200).send("DELETED");
    }
    res.status(404).send("Data Not Found");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = {
  getAllMovie,
  getMovieById,
  createMovie,
  updateMovieById,
  updateLanguageById,
  updateCastById,
  updateReleaseDateById,
  deleteMovieById,
};
