const jwt = require('jsonwebtoken');

class TokenController {
  getUserData = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // Получаем токен из заголовков запроса
    console.log("token =>", token);
    try {
      const decodedToken = jwt.verify(token, 'secretKey'); // Расшифровываем токен с использованием секретного ключа
      console.log("decodedToken =>", decodedToken);
      const userId = decodedToken.userId; // Получаем идентификатор пользователя из расшифрованного токена
      console.log("userId =>", userId);
      // Далее вы можете использовать идентификатор пользователя для получения его данных из базы данных или любого другого места

      // Пример:
      // const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
      // const userData = user.rows[0];

      // Отправляем данные пользователя в ответе
      res.status(200).json({ userId: userId, /* другие данные пользователя */ });
    } catch (error) {
      console.error('Ошибка при расшифровке токена:', error);
      res.status(401).json({ error: 'Ошибка при расшифровке токена' });
    }
  }
}

module.exports = new TokenController();
