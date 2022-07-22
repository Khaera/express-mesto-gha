const errorRouter = require('express').Router();
const NotFoundError = require('../utils/errors/not-found-err');

errorRouter.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не существует.'));
});

module.exports = errorRouter;
