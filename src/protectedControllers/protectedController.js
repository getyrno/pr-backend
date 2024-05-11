// server/controllers/protectedControllers/protectedController.js
exports.getProtectedData = (req, res) => {
  const userId = req.userId; // Получаем идентификатор пользователя из объекта запроса
  // Здесь вы можете выполнить запрос к базе данных или другие операции,
  // чтобы получить защищенные данные для пользователя
  res.json({ message: 'Protected data', userId });
};
