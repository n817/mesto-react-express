const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/AuthError');
const { urlRegEx } = require('../configs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => urlRegEx.test(v),
      message: 'Неправильный формат ссылки на аватар',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// метод проверяет логин/пароль и возвращает объект пользователя или ошибку
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      if (!user) {
        // инструкция throw генерирует исключение и обработка кода переходит в следующий блок catch
        throw new AuthError('неправильная почта и(или) пароль');
      }
      // нашёлся — сравниваем хеши пароля
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('неправильная почта и(или) пароль');
          }
          // хеши совпали — возвращаем пользователя
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
