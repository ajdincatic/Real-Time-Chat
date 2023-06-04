import socketIO from 'socket.io';

var io;
const users = [];

function setupSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', async (socket) => {
    socket.on('assign-socket-to-user', ({ userId }) => {
      users[userId] = { socket: socket.id, room: undefined };
    });

    socket.on('assign-active-room-to-user', ({ roomId, userId }) => {
      socket.join(roomId);
      users[userId] = { ...users[userId], room: roomId };
    });

    socket.on('remove-user-from-room', ({ roomId, userId }) => {
      socket.leave(roomId);
      for (const key in users) {
        if (users[key] === userId) {
          users[key].room = undefined;
          break;
        }
      }
    });

    socket.on('disconnect', () => {
      for (const key in users) {
        if (users[key].socket === socket.id) {
          delete users[key];
          break;
        }
      }
    });
  });
}

function emitChatEvent(data) {
  io.in(data.roomId).emit('update-messages-list', data);
}

function updateChatList(userIds, data) {
  for (const id of userIds) {
    // emit just to user that are connected
    if (users[id]?.socket) {
      io.to(users[id]?.socket).emit('update-rooms-list', data);
    }
  }
}

export { io, setupSocket, emitChatEvent, updateChatList };
