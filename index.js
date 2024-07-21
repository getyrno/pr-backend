require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createServer } = require('http');
const socketIo = require('socket.io');
const initSockets = require('./socket');
const db = require('./db');
// const redisClient = require('./redisClient');

// Создание приложения Express
const app = express();
const server = createServer(app);

// Безопасность HTTP заголовков
app.use(helmet());

// Включаем CORS с настройками безопасности
app.use(cors({
    origin: 'http://localhost:4200', // Разрешите запросы с вашего фронтенда
    methods: ['GET', 'POST'],
    credentials: true
}));

// Логирование HTTP запросов
// app.use(morgan('combined'));

// Подключаем middleware для обработки JSON и URL-кодированных данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключение маршрутов (авторизация, работа с пользователями и т.д.)
const authRoutes = require('./src/routes/authRoutes');
const loginRoutes = require('./src/routes/loginRoutes');
const tokenRoutes = require('./src/routes/tokenRoutes');
const userRoutes = require('./src/routes/userRoutes');
const chatRoutes = require('./src/messenger/routes/chatRoutes');
const protectedRoutes = require('./src/protectedRoutes/protectedRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/protected', protectedRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Инициализация Socket.IO с поддержкой CORS
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Запуск и настройка Socket.IO
initSockets(io, db);

// Запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
