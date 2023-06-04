import { Entity, Schema } from 'redis-om';
import { client, connect } from '../config/redis';

class Room extends Entity {}

const schema = new Schema(
  Room,
  {
    name: { type: 'string' },
    creatorId: { type: 'string' },
    memberIds: { type: 'string[]' },
    is1on1: { type: 'boolean' },
  },
  {
    dataStructure: 'JSON',
  }
);

async function getRoomRepository() {
  await connect();

  const repository = client.fetchRepository(schema);

  await repository.createIndex(); // if the index is already created nothing will happen

  return repository;
}

export async function getRoomsByUser(userId) {
  const repository = await getRoomRepository();

  const rooms = await repository
    .search()
    .where('memberIds')
    .contains(userId)
    .return.all();

  return rooms;
}

export async function getRoomById(roomId) {
  const repository = await getRoomRepository();

  const room = await repository.fetch(roomId);

  return room;
}

export async function get1on1RoomByMembers(loggedUserId, secondUserId) {
  const repository = await getRoomRepository();

  const room = await repository
    .search()
    .where('memberIds')
    .contains(loggedUserId)
    .and('memberIds')
    .contains(secondUserId)
    .return.first();

  return room;
}

export async function createRoom(data) {
  const repository = await getRoomRepository();

  const room = repository.createEntity(data);

  const id = await repository.save(room);

  return id;
}
