let users = {}; // Список пользователей и их статусов

const initSockets = (io, db) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('user_connected', async (userId) => {
      users[socket.id] = userId;
      console.log('User connected:', userId);

      // Обновляем last_seen при подключении
      await db.query('UPDATE users SET last_seen = $1 WHERE id = $2', [new Date(), userId]);

      io.emit('update_user_list', users);
    });

    socket.on('user_disconnected', async () => {
      const userId = users[socket.id];
      if (userId) {
        // Обновляем last_seen при отключении
        await db.query('UPDATE users SET last_seen = $1 WHERE id = $2', [new Date(), userId]);
        delete users[socket.id];
        io.emit('update_user_list', users);
        console.log('User disconnected:', userId);
      }
    });

    socket.on('disconnect', async () => {
      const userId = users[socket.id];
      if (userId) {
        // Обновляем last_seen при отключении
        await db.query('UPDATE users SET last_seen = $1 WHERE id = $2', [new Date(), userId]);
        delete users[socket.id];
        io.emit('update_user_list', users);
        console.log('User disconnected:', userId);
      }
    });

    socket.on('message', (data) => {
      const { chatId, content, user_id, sender_nickname, sent_at } = data;
      console.log(`Message received from user ${sender_nickname} (${user_id}) in chat ${chatId}: ${content} at ${sent_at}`);
      socket.to(chatId).emit('message', data);
    });

    socket.on('get_status', (userId) => {
      // console.log('User get_status:', userId);
      // console.log('User get_status:', users);

      const userSocketId = Object.keys(users).find(key => users[key] === userId);
      const userStatus = userSocketId ? 'online' : 'offline';
      // console.log('User userStatus:', userStatus);

      socket.emit('user_status', { userId, status: userStatus });
    });

    socket.on('joinRoom', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat room ${chatId}`);
    });

    socket.on('leaveRoom', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.id} left chat room ${chatId}`);
    });
  });
};

module.exports = initSockets;
