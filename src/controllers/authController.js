// controllers/authController.js
const SmsService = require('../services/smsService');
const db = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
  constructor() {
    this.smsService = new SmsService('platon.dev@mail.ru', 'z7qq7xvPRFr0BDpk1HLaHZHZPS');
    this.verificationCode = ''; // Добавляем переменную для хранения верификационного кода
  }

  generateToken(user) {
    console.log("userId:", user.id);
    const token = jwt.sign({ userId: user.id }, 'secretKey', { expiresIn: '1h' }); // Замените 'secretKey' на ваш секретный ключ
    console.log("token:", token);
    return token;
  }
  sendVerificationCode = async (req, res) => {
    const { phoneNumber } = req.body;
    console.log("phoneNumber:", phoneNumber);
    this.verificationCode = this.smsService.generateVerificationCode();
    console.log("verificationCode:", this.verificationCode);
    // try {
    //   const response = await this.smsService.sendVerificationCode(phoneNumber, verificationCode);
    //   console.log("response:", response);
    //   res.json(response);
    // } catch (error) {
    //   res.status(500).json({ error: error.message });
    // }
  }

  verifyCodeAndRegisterUser = async (req, res) => {
    const { phoneNumber, verifCode } = req.body;
    try {
        console.log("phoneNumber:", phoneNumber);
        console.log("verifCode:", verifCode);
        const repCode = verifCode.replace(/\D/g, '');
        console.log("repCode:", repCode);

        // Проверяем, существует ли пользователь с указанным номером телефона
        const userQuery = await db.query('SELECT * FROM users WHERE phone_number = $1', [phoneNumber]);
        const existingUser = userQuery.rows[0];
        console.log("existingUser:", existingUser);

        // Проверяем, соответствует ли верификационный код
        if (repCode === this.verificationCode) {
            // Если пользователь уже существует и верификационный код верный
            if (existingUser) {
                if (!existingUser.username || !existingUser.email || !existingUser.password) {
                    // Проверяем, что поля username, email и password не пустые
                    return res.json({ message: 'User data incomplete' });
                } else {
                    // Создаем токен для существующего пользователя
                    const token = this.generateToken(existingUser);
                    console.log("existingUser:", existingUser);
                    console.log("token:", token);
                    return res.json({ message: 'User already registered', token });
                }
            } else {
                // Регистрируем нового пользователя, если он не существует
                await db.query('INSERT INTO users (phone_number) VALUES ($1)', [phoneNumber]);
                return res.json({ message: 'User registered successfully' });
            }
        } else {
            // Если верификационный код неверный
            return res.status(400).json({ error: 'Invalid verification code' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}




  registerUser = async (req, res) => {
    const { username, phone, email, password } = req.body;
  
    try {
      // Проверяем, существует ли пользователь с указанным именем пользователя или номером телефона или почтой
      const userExistsQuery = 'SELECT * FROM users WHERE phone_number = $1 OR email = $2';
      const userExistsResult = await db.query(userExistsQuery, [username, email]);
  
      if (userExistsResult.rows.length > 0) {
        return res.status(400).json({ error: 'Пользователь с таким именем пользователя, номером телефона или почтой уже зарегистрирован.' });
      }
  
      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Добавляем нового пользователя в базу данных
      const insertUserQuery = `
        INSERT INTO users (phone_number, username, email, password)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (phone_number) DO UPDATE
        SET username = $2, email = $3, password = $4
        RETURNING *
      `;
      const insertResult = await db.query(insertUserQuery, [phone, username, email, hashedPassword]);
      const token = this.generateToken(insertResult.rows[0]);
      console.log("insertResult:", insertResult);
      console.log("insertResult.rows[0]:", insertResult.rows[0]);
      console.log("token:", token);

      // Возвращаем успешный ответ с данными пользователя
      res.status(200).json({ message: 'Данные пользователя успешно обновлены.', user: insertResult.rows[0], token });
    } catch (error) {
      console.error('Ошибка при регистрации пользователя:', error);
      res.status(500).json({ error: 'Ошибка сервера при регистрации пользователя.' });
    }
  }
}
module.exports = new AuthController();
