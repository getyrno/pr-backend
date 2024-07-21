// server/controllers/protectedControllers/protectedController.js
const db = require('../../db');

const getUserInfoById = async (userId) => {
    return db.query(
        'SELECT id, phone_number, username, avatar_url, nickname, status, last_seen, isdeleted, created_at, updated_at FROM users WHERE id = $1 AND isdeleted = false',
        [userId]
    );
};

exports.getUserInfo = async (req, res) => {
    const userId = req.userId;
    try {
        const result = await getUserInfoById(userId);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found or deleted' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getInfoAboutPerson = async (req, res) => {
    const userId = req.params.userId;
    try {
        const result = await getUserInfoById(userId);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found or deleted' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
