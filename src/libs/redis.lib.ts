//@ts-nocheck
import { createClient } from 'redis';
import config from '@/configs';
import { RedisCommandArgument } from '@redis/client/dist/lib/commands';

async function connection() {
  const client = createClient({
    url: config.redis.url,
  });
  await client.connect();

  client.on('error', (err) => console.log('Redis Client Error', err));
  client.on('connect', () => console.log('connected to redis successfully'));

  return client;
}

/**
 * Stores data to redis store.
 * @param key the key to use for storing the data
 * @param value the data to be stored
 * @param expiresIn time to delete the value in seconds default is 24hours
 */
export async function addToRedis(key: RedisCommandArgument, value: RedisCommandArgument | number, expiresIn = 60 * 60 * 24) {
  const redisClient = await connection();
  try {
    return await redisClient.set(key, value, 'Ex', expiresIn);
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Stores data to redis for caching.
 * @param key the key to use for storing the data
 * @param value the data to be stored
 * @param expiresIn time to delete the value in seconds default is 24hours
 */
export async function addToRedisForCaching(
  key: RedisCommandArgument,
  value: RedisCommandArgument | number,
  expiresIn = 360
) {
  const redisClient = await connection();
  try {
    return await redisClient.setEx(key, expiresIn, value);
  } catch (error) {
    throw new Error(error);
  }
}

/*
 * delete data on  redis store.
 * @param key the key to use for storing the data
 */
export async function delInRedis(key: RedisCommandArgument) {
  const redisClient = await connection();
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Gets data back from our redis store
 * @param key the key used to store the value
 */
export async function getFromRedis(key: RedisCommandArgument) {
  try {
    const redisClient = await connection();
    const value = await redisClient.get(key);
    return value;
  } catch (error) {
    throw new Error(error);
  }
}
