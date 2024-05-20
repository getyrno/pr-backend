const SmsService = require('../services/smsService');
const db = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../../redisClient');

class AuthController {
  constructor() {
    this.smsService = new SmsService('platon.dev@mail.ru', 'z7qq7xvPRFr0BDpk1HLaHZHZPS');
    this.verificationCode = '';
  }

  generateToken(user) {
    const token = jwt.sign({ userId: user.id }, 'art5Hikths87$fgd&vds#7dfJhszse89cks', { expiresIn: '7d' }); // Замените 'secretKey' на ваш секретный ключ
        return token;
  }

  sendVerificationCode = async (req, res) => {
    const { phoneNumber } = req.body;
    try {
      console.log(`Received phoneNumber: ${phoneNumber}`);
      this.verificationCode = this.smsService.generateVerificationCode();
      console.log(`Generated verification code: ${this.verificationCode}`);
      await redisClient.set(phoneNumber, this.verificationCode, 'EX', 300); // Сохраняем код в Redis на 5 минут
      res.json({ message: 'Verification code sent successfully' });
    } catch (error) {
      console.error(`Error sending verification code: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }

  verifyCodeAndRegisterUser = async (req, res) => {
    const { phoneNumber, verifCode } = req.body;
    try {
      console.log(`Received verification request for phoneNumber: ${phoneNumber}, code: ${verifCode}`);
      const reply = await redisClient.get(phoneNumber);
      console.log(`Received verification request for phoneNumber 2: ${phoneNumber}, code: ${reply}`);
      const repCode = verifCode.replace(/\D/g, '');
      console.log("repCode:", repCode);

      if (repCode === reply) {
        const userQuery = await db.query('SELECT * FROM users WHERE phone_number = $1', [phoneNumber]);
        const existingUser = userQuery.rows[0];

        if (existingUser) {
          if (!existingUser.username || !existingUser.password) {
            return res.json({ message: 'User data incomplete' });
          } else {
            const token = this.generateToken(existingUser);
            return res.json({ message: 'User already registered', token });
          }
        } else {
          await db.query('INSERT INTO users (phone_number) VALUES ($1)', [phoneNumber]);
          return res.json({ message: 'User registered successfully' });
        }
      } else {
        return res.status(400).json({ error: 'Invalid verification code' });
      }
    } catch (error) {
      console.error(`Error verifying code and registering user: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
  }

  registerUser = async (req, res) => {
    const { username, phone, password, avatar_url, nickname } = req.body;
    try {
      console.log("req.body:", req.body);

      const userExistsQuery = 'SELECT * FROM users WHERE phone_number = $1';
      const userExistsResult = await db.query(userExistsQuery, [phone]);

      if (userExistsResult.rows.length > 0) {
        console.log(`User with phone number ${phone} already exists`);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertUserQuery = `
        INSERT INTO users (phone_number, username, password, avatar_url, nickname)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (phone_number) DO UPDATE
        SET username = $2, password = $3, avatar_url = $4, nickname = $5
        RETURNING *
      `;
      const insertResult = await db.query(insertUserQuery, [phone, username, hashedPassword, avatar_url, nickname]);
      const token = this.generateToken(insertResult.rows[0]);

      console.log("User registered successfully:", insertResult.rows[0]);
      res.status(200).json({ message: 'Данные пользователя успешно обновлены.', user: insertResult.rows[0], token });
    } catch (error) {
      console.error(`Error registering user: ${error.message}`);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Ошибка сервера при регистрации пользователя.' });
      }
    }
  }
}

module.exports = new AuthController();

const insertUserQuery = `
        INSERT INTO users (phone_number, username, email, password)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (phone_number) DO UPDATE
        SET username = $2, email = $3, password = $4
        RETURNING *
      `;