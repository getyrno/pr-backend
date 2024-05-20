// src/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { createChat, getUserChats, getUserInfoByToken } = require('../controllers/chatController');

router.post('/create', createChat);
router.get('/user/:userId', getUserChats);
router.get('/user/:userId', getUserChats);
// router.post('/getdata',  getUserInfoByToken);

module.exports = router;
