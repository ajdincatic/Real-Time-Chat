import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import userRouter from './routes/user.routes';
import roomRouter from './routes/room.routes';
import messageRouter from './routes/message.routes';
import { setupSocket } from './socket/chat.socket';

const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);

setupSocket(server);

app.use('/user', userRouter);
app.use('/room', roomRouter);
app.use('/message', messageRouter);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
