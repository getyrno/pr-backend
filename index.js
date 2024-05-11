const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/authRoutes');
const loginRoutes = require('./src/routes/loginRoutes');
const tokenRoutes = require('./src/routes/tokenRoutes');

const cors = require('cors'); // Подключаем модуль CORS

// Инициализируем Express приложение
const app = express();
app.use(cors());

// Подключаем middleware для обработки JSON и URL-кодированных данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаем роуты
app.use('/api/auth', authRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/token', tokenRoutes);

// Запускаем сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
