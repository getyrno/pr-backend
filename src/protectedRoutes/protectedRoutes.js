// server/routes/protectedRoute/protectedRoutes.js
const express = require('express');
const router = express.Router();
const loginMiddleware = require('../middleware/loginMiddleware');
const protectedController = require('../controllers/protectedController');

// Маршрут, защищенный middleware аутентификации
router.get('/protected', loginMiddleware, protectedController.getProtectedData);

module.exports = router;
