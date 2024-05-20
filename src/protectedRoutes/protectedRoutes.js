// src/protectedRoutes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');
const protectedController = require('../protectedControllers/protectedController');
const chatController = require('../messenger/controllers/chatController');
const groupChatController = require('../messenger/controllers/groupChatController');
const userController = require('../messenger/controllers/userController');
const messageController = require('../messenger/controllers/messageController');

// Маршрут, защищенный middleware аутентификации
router.get('/info', middleware, protectedController.getUserInfo);
router.post('/chats/create', middleware, chatController.createChat);
router.get('/chats/getUserChats', middleware, chatController.getUserChats);
router.post('/group_chats/create', middleware, groupChatController.createGroupChat);
router.get('/group_chats/user/:userId', middleware, groupChatController.getUserGroupChats);
router.get('/users/:userId', middleware, userController.getUserInfo);
router.post('/messages/send', middleware, messageController.sendMessage);
router.get('/messages/:chatId', middleware, messageController.getMessages);

module.exports = router;
