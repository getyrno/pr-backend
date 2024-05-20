// socket.js
const initSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('message', (data) => {
      const { chatId, content, user_id, sender_nickname, sent_at } = data;
      console.log(`Message received from user ${sender_nickname} (${user_id}) in chat ${chatId}: ${content} at ${sent_at}`);
      socket.to(chatId).emit('message', data); // Отправка сообщения в комнату чата, исключая отправителя
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
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = initSockets;
