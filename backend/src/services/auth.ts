import redisClient from "../utils/redis";
import { User } from "../db/models/User";

const CACHE_TTL = 60 * 60; // 1 година

export const findOrCreateUser = async (
  auth0Id: string,
  email: string,
  name?: string,
  picture?: string
) => {
  // 1. Перевірити в Redis
  const cachedUser = await redisClient.get(`user:${auth0Id}`);
  if (cachedUser) {
    return JSON.parse(cachedUser);
  }

  // 2. Пошук у Mongo
  let user = await User.findOne({ auth0Id });

  // 3. Якщо нема — створити
  if (!user) {
    user = new User({ auth0Id, email, name, picture });
    await user.save();
  }

  // 4. Записати в Redis
  await redisClient.set(`user:${auth0Id}`, JSON.stringify(user), {
    EX: CACHE_TTL,
  });

  return user;
};

export const getUserByAuth0Id = async (auth0Id: string) => {
  const cachedUser = await redisClient.get(`user:${auth0Id}`);
  if (cachedUser) {
    return JSON.parse(cachedUser);
  }

  const user = await User.findOne({ auth0Id });

  if (user) {
    await redisClient.set(`user:${auth0Id}`, JSON.stringify(user), {
      EX: CACHE_TTL,
    });
  }

  return user;
};
