// server/middleware/loginMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key'; // Секретный ключ для проверки токена

module.exports = (req, res, next) => {
  // Получаем токен из заголовка запроса
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Проверяем и верифицируем токен
    const decodedToken = jwt.verify(token, secretKey);
    req.userId = decodedToken.userId; // Добавляем идентификатор пользователя в объект запроса
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};


// loginMiddleware.js:

// Этот middleware проверяет наличие и действительность токена в заголовке запроса.
// Если токен есть и действителен, он декодируется, и идентификатор пользователя добавляется в объект запроса (req.userId).
// Если токен отсутствует или недействителен, отправляется ответ с кодом статуса 401 (Unauthorized).