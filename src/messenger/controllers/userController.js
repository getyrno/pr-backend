// server/controllers/userController.js
const db = require('../../../db');

exports.getUserInfo = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await db.query('SELECT id, username, nickname, phone_number, avatar_url FROM users WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
