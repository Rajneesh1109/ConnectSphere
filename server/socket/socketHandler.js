const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected to socket: ${socket.id}`);

    // Add user to online users map when they connect and emit their user ID
    socket.on('addUser', (userId) => {
      onlineUsers.set(userId, socket.id);
      // Broadcast online users to all connected clients
      io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
      console.log(`User ${userId} is online. Total online: ${onlineUsers.size}`);
    });

    // Handle sending a private message
    socket.on('sendMessage', ({ senderId, receiverId, content }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('getMessage', {
          senderId,
          content,
          createdAt: new Date(),
        });
      }
    });

    // Handle typing events
    socket.on('typing', ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing', { senderId });
      }
    });

    socket.on('stopTyping', ({ senderId, receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('stopTyping', { senderId });
      }
    });


    // Handle user disconnect
    socket.on('disconnect', () => {
      // Find the user ID based on socket ID and remove from map
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
          console.log(`User ${userId} went offline. Total online: ${onlineUsers.size}`);
          break;
        }
      }
      console.log(`User disconnected from socket: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
