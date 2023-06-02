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

    socket.on('assign-active-room-to-user', ({ selectedRoomId, userId }) => {
      socket.join(selectedRoomId);
      users[userId] = { ...users[userId], room: selectedRoomId };
    });

    socket.on('remove-user-from-room', ({ roomId, userId }) => {
      socket.leave(roomId);
      for (const key in users) {
        if (users[key].room === roomId) {
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
    io.to(users[id].socket).emit('update-rooms-list', data);
  }
}

export { io, setupSocket, emitChatEvent, updateChatList };
