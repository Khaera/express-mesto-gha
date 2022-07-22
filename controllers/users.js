const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../utils/errors/bad-request-err');
const ConflictError = require('../utils/errors/conflict-err');
const NotFoundError = require('../utils/errors/not-found-err');
const UnauthorizedError = require('../utils/errors/unauthorized-err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный id.'));
      }
      return next(err);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден.');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный id.'));
      }
      return next(err);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
        }
        if (err.code === 11000) {
          return next(new ConflictError('Пользователь с таким email уже зарегистрирован.'));
        }
        return next(err);
      })
      .catch(next));
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findById(userId)
    .then((user) => {
      if (JSON.stringify(userId) !== JSON.stringify(user._id)) {
        throw new UnauthorizedError('Нельзя изменить даннные другого пользователя.');
      }
      return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
        .then((userData) => {
          if (!userData) {
            throw new NotFoundError('Пользователь с указанным id не найден.');
          }
          return res.send(userData);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
          }
          return next(err);
        })
        .catch(next);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const userId = req.user._id;

  const { avatar } = req.body;

  User.findById(userId)
    .then((user) => {
      if (JSON.stringify(userId) !== JSON.stringify(user._id)) {
        throw new UnauthorizedError('Нельзя изменить аватар другого пользователя.');
      }
      return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
        .then((userData) => {
          if (!userData) {
            throw new NotFoundError('Пользователь с указанным id не найден.');
          }
          return res.send(userData);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
          }
          return next(err);
        })
        .catch(next);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret-key',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
