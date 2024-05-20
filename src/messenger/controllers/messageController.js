// src/messenger/controllers/messageController.js
const db = require('../../../db');

exports.sendMessage = async (req, res) => {
    const { chatId, senderId, senderNickname, text } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO messages (chat_id, user_id, sender_nickname, content) VALUES ($1, $2, $3, $4) RETURNING *',
            [chatId, senderId, senderNickname, text]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const result = await db.query(
            'SELECT * FROM messages WHERE chat_id = $1 ORDER BY sent_at ASC',
            [chatId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
