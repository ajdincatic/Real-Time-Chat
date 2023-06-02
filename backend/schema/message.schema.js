import { Entity, Schema } from 'redis-om';
import { client, connect } from '../config/redis';

class Message extends Entity {}

const schema = new Schema(
  Message,
  {
    senderUserId: { type: 'string' },
    message: { type: 'string' },
    roomId: { type: 'string' },
    timestamp: { type: 'date', sortable: true },
    senderUsername: { type: 'string' },
    sentByMe: { type: 'boolean' },
  },
  {
    dataStructure: 'JSON',
  }
);

async function getMesssageRepository() {
  await connect();

  const repository = client.fetchRepository(schema);

  await repository.createIndex(); // if the index is already created nothing will happen

  return repository;
}

export async function getAllMessages() {
  const repository = await getMesssageRepository();

  const messages = await repository.search().return.all();

  return messages;
}

export async function getMessagesByRoom(roomId) {
  const repository = await getMesssageRepository();

  const messages = await repository
    .search()
    .where('roomId')
    .equalTo(roomId)
    .sortBy('timestamp', 'ASC')
    .return.all();

  return messages;
}

export async function getLastMessageByRoom(roomId) {
  const repository = await getMesssageRepository();

  const messages = await repository
    .search()
    .where('roomId')
    .equalTo(roomId)
    .sortBy('timestamp', 'DESC')
    .first();

  return messages;
}

export async function createMessage(data) {
  const repository = await getMesssageRepository();

  const message = repository.createEntity(data);

  const id = await repository.save(message);

  return id;
}
