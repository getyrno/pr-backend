// server/routes/loginRoutes.js
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Маршрут для аутентификации пользователя и генерации токена
router.post('/login', loginController.login);

module.exports = router;
