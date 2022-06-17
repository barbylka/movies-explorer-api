const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getUsersMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');
const { urlValidator } = require('../utils/validation');

const movieRouter = express.Router();

movieRouter.get('/', getUsersMovies);
movieRouter.post('/', express.json(), celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidator),
    trailerLink: Joi.string().required().custom(urlValidator),
    thumbnail: Joi.string().required().custom(urlValidator),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovie);
movieRouter.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = {
  movieRouter,
};
