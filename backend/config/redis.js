import dotenv from 'dotenv';
dotenv.config();

import { Client } from 'redis-om';

const client = new Client();

async function connect() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
  }
}

export { client, connect };
