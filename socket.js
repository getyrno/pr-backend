let users = {}; // Список пользователей и их статусов

const initSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('message', (data) => {
      const { chatId, content, user_id, sender_nickname, sent_at } = data;
      console.log(`Message received from user ${sender_nickname} (${user_id}) in chat ${chatId}: ${content} at ${sent_at}`);
      socket.to(chatId).emit('message', data);
    });

    socket.on('user_connected', (userId) => {
      users[socket.id] = userId;
      console.log('User user_connected:', users);
      io.emit('update_user_list', users);
    });

    socket.on('get_status', (userId) => {
      console.log('User get_status:', userId);
      console.log('User get_status:', users);
      
      const userSocketId = Object.keys(users).find(key => users[key] === userId);
      const userStatus = userSocketId ? 'online' : 'offline';
      console.log('User userStatus:', userStatus);
      
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

    socket.on('disconnect', () => {
      delete users[socket.id];
      io.emit('update_user_list', users);
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = initSockets;