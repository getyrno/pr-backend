const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/getMessages/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const messagesQuery = await db.query('SELECT * FROM messages WHERE receiver = $1 OR sender = $1 ORDER BY created_at ASC', [userId]);
        res.status(200).json(messagesQuery.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
