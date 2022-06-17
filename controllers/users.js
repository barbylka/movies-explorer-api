const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { DUPLICATE_MONGOOSE_ERROR, SALT_ROUNDS } = require('../utils/constants');
const { secretKey } = require('../utils/configuration');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.send(user);
    } else {
      throw new NotFoundError('Пользователь не найден');
    }
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      {
        new: true,
        runValidators: true,
      },
    );
    if (user) {
      res.send(user);
    } else {
      throw new NotFoundError('Пользователь не найден');
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id пользователя'));
    } else if (err.code === DUPLICATE_MONGOOSE_ERROR) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    } else {
      next(err);
    }
  }
};

const signup = async (req, res, next) => {
  try {
    if (validator.isEmail(req.body.email)) {
      const {
        email, password, name,
      } = req.body;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      let user = await User.create({
        email, password: hashedPassword, name,
      });
      user = user.toObject();
      delete user.password;
      res.status(201).send(user);
    } else {
      next(new BadRequestError('Передан некорректный email'));
    }
  } catch (err) {
    if (err.code === DUPLICATE_MONGOOSE_ERROR) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    if (!user) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    } else {
      const token = await jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : secretKey, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .status(200).send({ token });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCurrentUser,
  updateUser,
  signup,
  signin,
};
