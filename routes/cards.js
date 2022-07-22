const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^https?:\/\/(www.)?\S/i),
  }),
}), createCard);
cardRouter.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(/^[a-f\d]{24}$/i),
  }),
}), deleteCard);
cardRouter.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(/^[a-f\d]{24}$/i),
  }),
}), likeCard);
cardRouter.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(/^[a-f\d]{24}$/i),
  }),
}), dislikeCard);

module.exports = cardRouter;
