// server/controllers/groupChatController.js
const db = require('../../../db');

const createGroupChat = async (req, res) => {
    const { name, avatarUrl, userIds } = req.body;
    try {
        const groupChatResult = await db.query('INSERT INTO group_chats (name, avatar_url, user_ids) VALUES ($1, $2, $3) RETURNING *', [name, avatarUrl, userIds]);
        res.status(201).json(groupChatResult.rows[0]);
    } catch (error) {
        console.error('Error creating group chat:', error);
        res.status(500).json({ error: 'Error creating group chat' });
    }
};

const getUserGroupChats = async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const result = await db.query('SELECT * FROM group_chats WHERE $1 = ANY(user_ids)', [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error getting user group chats:', error);
        res.status(500).json({ error: 'Error getting user group chats' });
    }
};

module.exports = { createGroupChat, getUserGroupChats };
