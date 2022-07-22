const errorRouter = require('express').Router();

const NOT_FOUND = 404;

errorRouter.all('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не существует.' });
});

module.exports = errorRouter;
