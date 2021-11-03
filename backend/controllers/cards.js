const Card = require('../models/card');
const CastError = require('../errors/CastError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

// возвращает все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .then((cardsData) => res.status(200).send(cardsData))
    .catch(next); // эквивалентна catch(err => next(err))
};

// создаёт карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cardData) => res.status(201).send(cardData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CastError(`При создании карточки переданы некорректные данные: ${err.message}`));
      }
      next(err);
    });
};

// удаляет карточку по идентификатору
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('не найдена карточка по заданному id');
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('запрещено удалять карточки других пользователей');
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then((cardData) => res.status(200).send(cardData))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Невалидный id карточки'));
      }
      next(err);
    });
};

// ставит лайк карточке
const putCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('не найдена карточка по заданному id');
    })
    .then((cardData) => res.status(200).send(cardData))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Невалидный id карточки'));
      }
      next(err);
    });
};

// убирает лайк с карточки
const removeCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('не найдена карточка по заданному id');
    })
    .then((cardData) => res.status(200).send(cardData))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Невалидный id карточки'));
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putCardLike,
  removeCardLike,
};
