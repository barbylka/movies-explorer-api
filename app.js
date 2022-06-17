const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const { limiter, mongoLink } = require('./utils/configuration');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, NODE_ENV, MONGODB_LINK } = process.env;
const app = express();

app.use(cookieParser());

app.use(cors({
  origin: 'https:/diplomaa.nomoredomains.xyz',
  credentials: true,
}));

mongoose.connect(NODE_ENV === 'production' ? MONGODB_LINK : mongoLink, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use(requestLogger);

app.use(limiter);

app.use(helmet());
app.use('/', router);
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
