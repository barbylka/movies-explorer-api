const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/me', getCurrentUser);
userRouter.patch('/me', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

module.exports = {
  userRouter,
};
