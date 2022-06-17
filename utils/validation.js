const validator = require('validator');
const BadRequestError = require('../errors/BadRequestError');

const urlValidator = (value) => {
  if (validator.isURL(value)) {
    return value;
  }
  throw new BadRequestError('Введенная ссылка некоректна');
};

module.exports = {
  urlValidator,
};
