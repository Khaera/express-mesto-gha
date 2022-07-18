const Card = require('../models/card');

const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ owner, name, link })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST)
          .send(console.log(owner));
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card.owner !== req.user._id) {
        return Promise.reject(new Error('Нельзя удалить чужую карточку'));
      }
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена.' });
      }
      return res.send({ message: 'Пост удалён.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Передан некорректный id карточки.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const likeCard = (req, res) => {
  const { cardId, userId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена.' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Передан некорректный id карточки.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const dislikeCard = (req, res) => {
  const { cardId, userId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена.' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Передан некорректный id карточки.' });
      }
      return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
