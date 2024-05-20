const db = require('../../../db');

const createChat = async (req, res) => {
    const { name, userIds } = req.body;
    const isGroup = userIds.length > 2;
    try {
        // Проверка на существование чата между пользователями (если это не групповой чат)
        if (!isGroup) {
            const existingChatResult = await db.query(`
                SELECT c.* FROM chats c
                JOIN chat_members cm1 ON c.id = cm1.chat_id
                JOIN chat_members cm2 ON c.id = cm2.chat_id
                WHERE cm1.user_id = $1 AND cm2.user_id = $2 
            `, [userIds[0], userIds[1]]);

            if (existingChatResult.rows.length > 0) {
                return res.status(200).json(existingChatResult.rows[0]); // Возвращаем существующий чат
            }
        }

        // Создание нового чата
        const chatResult = await db.query(
            'INSERT INTO chats (user_ids) VALUES ($1) RETURNING *',
            [JSON.stringify(userIds)]
        );
        const chatId = chatResult.rows[0].id;

        // Добавление участников чата
        const chatMembersQueries = userIds.map(userId => {
            return db.query('INSERT INTO chat_members (chat_id, user_id) VALUES ($1, $2)', [chatId, userId]);
        });
        await Promise.all(chatMembersQueries);

        res.status(201).json(chatResult.rows[0]);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ error: 'Error creating chat' });
    }
};

const getUserChats = async (req, res) => {
    const userId = req.userId; // Получаем userId из middleware
    try {
        const result = await db.query(`
            SELECT c.* FROM chats c
            JOIN chat_members cm ON c.id = cm.chat_id
            WHERE cm.user_id = $1
        `, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error getting user chats:', error);
        res.status(500).json({ error: 'Error getting user chats' });
    }
};

module.exports = { createChat, getUserChats };
 