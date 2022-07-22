const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getCurrentUser);
userRouter.get('/users/:userId', getUser);
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^https?:\/\/(www.)?\S/i),
  }),
}), updateAvatar);

module.exports = userRouter;
