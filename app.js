const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const errorRouter = require('./routes/error');

const auth = require('./middlewares/auth');

const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const handleErrors = require('./middlewares/handleErrors');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(www.)?\S/i),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', errorRouter);
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Сервер запущен. Порт: ${PORT}`);
});
