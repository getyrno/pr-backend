const db = require('../../db');

exports.searchUsers = async (req, res) => {
  const query = req.query.query;
  try {
    const users = await db.query(
      `SELECT * FROM users WHERE phone_number ILIKE $1 OR username ILIKE $1 OR nickname ILIKE $1`,
      [`%${query}%`]
    );
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
