const express = require('express');
const { celebrate, Joi } = require('celebrate');

const { signup, signin } = require('../controllers/users');

const signRouter = express.Router();

signRouter.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), signup);

signRouter.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signin);

signRouter.post('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

module.exports = {
  signRouter,
};
