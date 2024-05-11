// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/send-verification-code', authController.sendVerificationCode);
router.post('/verify-user', authController.verifyCodeAndRegisterUser);
router.post('/register-user', authController.registerUser);

module.exports = router;
