const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const SALT_ROUNDS = 10;

// GET /users
module.exports.getUsers = (req, res, next) => {
  User.findOne({ _id: req.user })
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};
// GET /users/:userId
module.exports.getUserId = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id.');
      }
      res.send(user);
    })
    .catch(next);
};
// POST /users
module.exports.createUser = (req, res, next) => {
  const {
    name = 'someName',
    about = 'something about',
    avatar = 'https://img2.pngio.com/smile-icon-transparent-png-clipart-free-download-yawd-smiling-face-png-2400_2400.png', email,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже есть');
      }
      return bcrypt.hash(req.body.password, SALT_ROUNDS)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))
        .then((data) => {
          res.status(201).send(data);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`${err.message}`));
      }
      return next(err);
    });
};
// PATCH /users/me
module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
    .then((me) => {
      res.status(200).send(me);
    })
    .catch(next);
};
// PATCH /users/me/avatar
module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true })
    .then((avatar) => {
      res.status(200).send(avatar);
    })
    .catch(next);
};
// POST /login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      // проверяем пароль
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return user; // если всё верно, возвращаем найденного usera
        });
    })
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};
