import { Point } from "../db/models/Point";
import { env } from "../utils/env";
import redisClient from "../utils/redis";

const GOOGLE_API_KEY = env("GOOGLE_API_KEY");

export const getPointsByUser = async (userId: string, status?: string) => {
  const cacheKey = status ? `points:${userId}:${status}` : `points:${userId}`;
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const query: any = { userId };
  if (status) query.status = status;

  const points = await Point.find(query);
  await redisClient.set(cacheKey, JSON.stringify(points), { EX: 3600 });
  return points;
};

export const createPoint = (data: any) => Point.create(data);

export const updateUserPointById = (userId: string, id: string, data: any) =>
  Point.findOneAndUpdate({ _id: id, userId }, data, { new: true });

export const deleteUserPointById = (userId: string, id: string) =>
  Point.findOneAndDelete({ _id: id, userId });

export const searchPlacesByText = async (query: string) => {
  const hashKey = "places:search";
  const field = query.toLowerCase().trim();

  const cached = await redisClient.hGet(hashKey, field);
  if (cached) return JSON.parse(cached);

  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
    query
  )}&inputtype=textquery&fields=name,geometry&key=${GOOGLE_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch from Google Places API");
  }

  const data = await response.json();

  const result =
    data.candidates?.map((candidate: any) => ({
      name: candidate.name,
      location: candidate.geometry?.location,
    })) || [];

  await redisClient.hSet(hashKey, field, JSON.stringify(result));
  await redisClient.expire(hashKey, 86400);

  return result;
};
