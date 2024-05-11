// server/routes/tokenRoutes.js
const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

// Маршрут для аутентификации пользователя и генерации токена
router.post('/getdata', tokenController.getUserData);

module.exports = router;
