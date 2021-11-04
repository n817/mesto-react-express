const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');
const { JWT_SECRET } = require('../configs');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  // попытаемся верифицировать токен
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
