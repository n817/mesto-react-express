const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlRegEx } = require('../configs');

const {
  getUsers,
  getUser,
  getMe,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getUsers);

// возвращает информацию о текущем пользователе
router.get('/me', getMe);

// возвращает пользователя по _id
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);

// обновляет аватар
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegEx),
  }),
}), updateAvatar);

// обновляет профиль
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

module.exports = router;
