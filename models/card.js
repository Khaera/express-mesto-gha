const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');
const isLength = require('validator/lib/isLength');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: (v) => isLength(v),
        options: [2, 30],
        message: 'Поле "name" должно быть не менее 2 и не более 30 символов.',
      },
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (v) => isUrl(v),
        message: 'Неправильный формат ссылки',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
