const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlRegEx } = require('../configs');
const {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  removeCardLike,
} = require('../controllers/cards');

// возвращает все карточки
router.get('/', getCards);

// создаёт карточку
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegEx),
  }),
}), createCard);

// удаляет карточку по идентификатору
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

// ставит лайк карточке
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), putCardLike);

// убирает лайк с карточки
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), removeCardLike);

module.exports = router;
