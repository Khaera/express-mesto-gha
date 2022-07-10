const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const { NOT_FOUND } = require('./utils/errors');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62cb02b688222f3bc8a5f961',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req, res, next) => {
  res.status(NOT_FOUND).send({ message: 'Страница не существует.' });

  next();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен. Порт: ${PORT}`);
});
