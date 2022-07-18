const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const auth = require('./middlewares/auth');

const login = require('./controllers/login');
const { createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const { NOT_FOUND } = require('./utils/errors');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не существует.' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен. Порт: ${PORT}`);
});
