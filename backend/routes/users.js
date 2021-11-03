const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlRegEx } = require('../configs');

const {
  getUsers,
  getUser,
  getMe,
  updateAvatar,
  updateProfile,
  signOut,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getUsers);

// возвращает пользователя по _id
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);

// возвращает информацию о текущем пользователе
router.get('/me', getMe);

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

// выходит из профиля и чистит куки
router.get('/signout', signOut);

module.exports = router;
