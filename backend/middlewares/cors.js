// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://mesto.n817.nomoredomains.xyz',
  'http://mesto.n817.nomoredomains.xyz',
  'localhost:3000',
];

// Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // eslint-disable-next-line no-console
  console.log(`источник запроса: ${origin}`);
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  // eslint-disable-next-line no-console
  console.log(`тип запроса: ${method}`);
  const requestHeaders = req.headers['access-control-request-headers']; // сохраняем список заголовков исходного запроса

  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
    // eslint-disable-next-line no-console
    console.log(`устанавливаем заголовок: ${res.header}`);
  }

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS); // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Headers', requestHeaders); // разрешаем кросс-доменные запросы с этими заголовками
    // eslint-disable-next-line no-console
    console.log(`устанавливаем заголовок: ${res.header}`);
    return res.end(); // завершаем обработку запроса и возвращаем результат клиенту
  }

  next();
};
