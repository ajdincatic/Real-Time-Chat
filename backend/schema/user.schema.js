import { Entity, Schema } from 'redis-om';
import { client, connect } from '../config/redis';

class User extends Entity {}

const schema = new Schema(
  User,
  {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    username: { type: 'string' },
    password: { type: 'string' },
  },
  {
    dataStructure: 'JSON',
  }
);

async function getUserRepository() {
  await connect();

  const repository = client.fetchRepository(schema);

  await repository.createIndex(); // if the index is already created nothing will happen

  return repository;
}

export async function getAllUsers() {
  const repository = await getUserRepository();

  let users = await repository.search().return.all();

  users = users.map(({ entityId, firstName, lastName, username }) => ({
    entityId,
    firstName,
    lastName,
    username,
  }));

  return users;
}

export async function getUserById(userId) {
  const repository = await getUserRepository();

  const user = await repository.fetch(userId);

  delete user.password;

  return user;
}

export async function getFirstUserByField(fieldName, value) {
  const repository = await getUserRepository();

  const user = await repository
    .search()
    .where(fieldName)
    .equal(value)
    .return.first();

  return user;
}

export async function searchUsersByField(fieldName, value) {
  const repository = await getUserRepository();

  const user = await repository
    .search()
    .where(fieldName)
    .equal(value)
    .return.all();

  return user;
}

export async function createUser(data) {
  const repository = await getUserRepository();

  const user = repository.createEntity(data);

  const id = await repository.save(user);

  return id;
}
