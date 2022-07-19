const handleErrors = (err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  return next(res.status(500).send({ message: 'На сервере произошла ошибка.' }));
};

module.exports = handleErrors;
