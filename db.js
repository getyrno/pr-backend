const { Client } = require('pg');

// Настройка PostgreSQL
const db = new Client({
    user: 'gen_user',
    host: '147.45.151.215',
    database: 'default_db',
    password: 'LeVde59rTthlNxAqzcZM4mCZ9H9C0E',
    port: 5432,
});

db.connect()
    .then(() => console.log('Connected to database'))
    .catch(err => {
        console.error('Database connection error:', err);
        // Дополнительный вывод ошибки
        console.error('Error details:', {
            user: 'gen_user',
            host: '147.45.151.215',
            database: 'default_db',
            password: 'LeVde59rTthlNxAqzcZM4mCZ9H9C0E',
            port: 5432,
        });
    });

module.exports = db;
