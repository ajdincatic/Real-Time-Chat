import { Router } from 'express';
import {
  getUserDataFromToken,
  requireAuth,
} from '../middleware/auth.middleware';
import { createMessage } from '../schema/message.schema';
import { getRoomById } from '../schema/room.schema';
import { limiter } from '../middleware/rate-limiter.middleware';
import { getUserById } from '../schema/user.schema';
import { emitChatEvent, updateChatList } from '../socket/chat.socket';

const router = Router();

router.post('/send', requireAuth, limiter, async (req, res) => {
  let { message, roomId } = req.body;

  const senderUserId = getUserDataFromToken(req).id;
  const timestamp = new Date();

  const room = await getRoomById(roomId);

  if (!room.memberIds && !room.name) {
    return res.status(400).json({ error: 'Undefined room' });
  }

  const messagePayload = {
    message,
    roomId,
    senderUserId,
    timestamp,
    senderUsername: (await getUserById(senderUserId)).username,
  };

  const id = await createMessage(messagePayload).catch(() => {
    return res.status(500).json({ error: 'Internal server error' });
  });

  messagePayload.room = room;

  emitChatEvent(messagePayload);
  updateChatList(room.memberIds, messagePayload);

  res.status(201).json({ id });
});

export default router;
