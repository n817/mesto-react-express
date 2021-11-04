const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SALT_ROUND } = require('../configs');
const User = require('../models/user');
const CastError = require('../errors/CastError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

const { NODE_ENV, JWT_SECRET } = process.env;

// проводит аутентификацию пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((userData) => {
      // успешная аутентификация, пользователь в переменной userData
      // создадим и вернем токен
      const token = jwt.sign(
        { _id: userData._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      // отправим токен, браузер сохранит его в куках
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7, // cookie будут храниться 7 дней
          httpOnly: true,
        })
        .status(200)
        .send(userData);
    })
    .catch(next); // эквивалентна catch(err => next(err))
};

// возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((usersData) => res.status(200).send(usersData))
    .catch(next);
};

// возвращает пользователя по _id
const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((userData) => {
      if (userData) {
        res.status(200).send(userData);
      }
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Невалидный id пользователя'));
      }
      next(err);
    });
};

// возвращает информацию о текущем пользователе
const getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((userData) => {
      if (userData) {
        res.status(200).send(userData);
      }
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь не найден'));
      }
      next(err);
    });
};

// создаёт пользователя
const createUser = (req, res, next) => {
  const { email, password } = req.body;
  // проверяем, переданы ли логин и пароль
  if (!email || !password) {
    throw new CastError('При создании пользователя переданы некорректные данные');
  }
  // проверяем, существует ли уже пользователь с таким email
  // если нет, то возвращаем хэш пароля
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(`Такой email уже существует у пользователя id ${user._id}`);
      }
      return bcrypt.hash(password, SALT_ROUND);
    })
    // создаем пользователя
    .then((hash) => User.create({ email, password: hash }))
    .then((userData) => res.status(201).send(userData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`При создании пользователя переданы некорректные данные: ${err.message}`));
      }
      next(err);
    });
};

// обновляет аватар
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }, // then получит обновлённые данные + валидация данных
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден по заданному id');
    })
    .then((userData) => res.status(200).send(userData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`При обновлении аватара переданы некорректные данные: ${err.message}`));
      }
      next(err);
    });
};

// обновляет профиль
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }, // then получит обновлённые данные + валидация данных
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден по заданному id');
    })
    .then((userData) => res.status(200).send(userData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`При обновлении профиля переданы некорректные данные: ${err.message}`));
      }
      next(err);
    });
};

// выходит из профиля и чистит куки
const signOut = (req, res) => {
  res
    .clearCookie('jwt')
    .status(200)
    .send({ message: 'Пользователь успешно разлогинен, куки удалены' });
};

module.exports = {
  login,
  getUsers,
  getUser,
  getMe,
  createUser,
  updateAvatar,
  updateProfile,
  signOut,
};
