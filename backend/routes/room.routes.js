import { Router } from 'express';
import {
  createRoom,
  getRoomsByUser,
  getRoomById,
  get1on1RoomByMembers,
} from '../schema/room.schema';
import {
  getUserDataFromToken,
  requireAuth,
} from '../middleware/auth.middleware';
import { getUserById } from '../schema/user.schema';
import {
  getMessagesByRoom,
  getLastMessageByRoom,
} from '../schema/message.schema';
import { limiter } from '../middleware/rate-limiter.middleware';

const router = Router();

router.post('/create', requireAuth, limiter, async (req, res) => {
  let { name, memberIds } = req.body;

  const creatorId = getUserDataFromToken(req).id;

  memberIds = [creatorId, ...memberIds];

  if (memberIds.length < 2) {
    return res.status(400).json({ error: 'Error creating room' });
  }

  const is1on1 = memberIds.length == 2;

  const id = await createRoom({
    name,
    creatorId,
    memberIds,
    is1on1,
  }).catch(() => {
    return res.status(500).json({ error: 'Internal server error' });
  });

  res.status(201).json({ id });
});

router.get('/me', requireAuth, async (req, res) => {
  const loggedUserId = getUserDataFromToken(req).id;

  const rooms = await getRoomsByUser(loggedUserId).catch(() => {
    return res.status(500).json({ error: 'Internal server error' });
  });

  let roomsResponse = [];
  for await (const room of rooms) {
    // if the chat is 1on1 name of the chat is the username of the second person
    if (room.is1on1) {
      const secondUserId = room.memberIds.filter((x) => x !== loggedUserId)[0];

      const secondUser = await getUserById(secondUserId);

      room.name = secondUser.username;
    }

    const lastMessage = await getLastMessageByRoom(room.entityId).catch(() => {
      return res.status(500).json({ error: 'Internal server error' });
    });

    if (lastMessage !== null) {
      lastMessage.senderUsername = (
        await getUserById(lastMessage.senderUserId)
      ).username;
      lastMessage.sentByMe =
        (await getUserById(lastMessage.senderUserId)).entityId === loggedUserId;
    }

    let roomCopy = {
      entityId: room.entityId,
      name: room.name,
      is1on1: room.is1on1,
      lastMessage,
    };
    roomsResponse = [...roomsResponse, roomCopy];
  }

  const roomsOrderedByTimeOfLastMessage = roomsResponse.sort((a, b) => {
    const timestampA = a.lastMessage?.timestamp
      ? new Date(a.lastMessage.timestamp).getTime()
      : 0;
    const timestampB = b.lastMessage?.timestamp
      ? new Date(b.lastMessage.timestamp).getTime()
      : 0;
    return timestampB - timestampA;
  });

  res.status(200).json(roomsOrderedByTimeOfLastMessage);
});

router.get('/1on1-by-members', requireAuth, async (req, res) => {
  const { secondUserId } = req.query;
  const loggedUserId = getUserDataFromToken(req).id;

  const room = await get1on1RoomByMembers(loggedUserId, secondUserId).catch(
    () => {
      return res.status(500).json({ error: 'Internal server error' });
    }
  );

  res.status(200).json({ room });
});

router.get('/:roomId', requireAuth, async (req, res) => {
  const loggedUserId = getUserDataFromToken(req).id;
  const roomId = req.params.roomId;

  const room = await getRoomById(roomId).catch(() => {
    return res.status(500).json({ error: 'Internal server error' });
  });

  if (!checkIfUserIsRoomMember(room, loggedUserId)) {
    return res.status(500).json({ error: 'You are not member of this chat' });
  }

  if (room.is1on1) {
    const secondUserId = room.memberIds.filter((x) => x !== loggedUserId)[0];

    const secondUser = await getUserById(secondUserId);

    room.name = secondUser.username;
  }

  const messages = await getMessagesByRoom(roomId).catch(() => {
    return res.status(500).json({ error: 'Internal server error' });
  });

  for await (const message of messages) {
    message.senderUsername = (await getUserById(message.senderUserId)).username;
    message.sentByMe =
      (await getUserById(message.senderUserId)).entityId === loggedUserId;
  }

  res.status(200).json({ room, messages });
});

function checkIfUserIsRoomMember(room, userId) {
  return room?.memberIds?.some((x) => x === userId);
}

export default router;
