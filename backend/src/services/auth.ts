import redisClient from "../utils/redis";
import { User } from "../db/models/User";

const CACHE_TTL = 60 * 60;

export const findOrCreateUser = async (
  googleId: string,
  email: string,
  name?: string,
  picture?: string
) => {
  const cacheKey = `user:${googleId}`;
  const cachedUser = await redisClient.get(cacheKey);
  if (cachedUser) return JSON.parse(cachedUser);

  let user = await User.findOne({ googleId });

  if (!user) {
    user = new User({ googleId, email, name, picture });
    await user.save();
  }

  await redisClient.set(cacheKey, JSON.stringify(user), { EX: CACHE_TTL });
  return user;
};

export const getUserById = async (id: string) => {
  const cachedUser = await redisClient.get(`user:${id}`);
  if (cachedUser) return JSON.parse(cachedUser);

  const user = await User.findById(id);
  if (user) {
    await redisClient.set(`user:${id}`, JSON.stringify(user), {
      EX: CACHE_TTL,
    });
  }

  return user;
};
