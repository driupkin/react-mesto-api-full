require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const cors = require('cors');

const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validationCreateUser } = require('./middlewares/requestValidation');

const app = express();
const { PORT = 3000 } = process.env;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validationCreateUser, login);
app.post('/signup', validationCreateUser, createUser);

app.use(auth);

app.use('/', users);
app.use('/', cards);

app.all('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден.')));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { status = 500, message } = err;

  res
    .status(status)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: status === 500
        ? `На сервере произошла ошибка: ${err.message}`
        : message,
    });
  return next();
});

app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});
