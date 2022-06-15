const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getUsersMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id }).populate('owner');
    res.status(200).send(movies);
  } catch (err) {
    next(err);
  }
};

const postMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const { _id } = req.user;
    const newMovie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: _id,
      movieId,
      nameRU,
      nameEN,
    });
    const movie = await Movie.findById(newMovie._id).populate('owner');
    res.status(201).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные фильма'));
    } else {
      next(err);
    }
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params._id);
    if (movie && movie.owner.toString() === req.user._id) {
      await movie.remove();
      res.status(200).send({
        message: 'Фильм удален',
      });
    } else if (!movie) {
      throw new NotFoundError('Фильм не найден');
    } else {
      throw new ForbiddenError('Нельзя удалять чужие фильмы');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id фильма'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUsersMovies,
  postMovie,
  deleteMovie,
};
