import { Point } from "../db/models/Point";
import { env } from "../utils/env";
import redisClient from "../utils/redis";
import { haversineDistance } from "../utils/distance";

const MAPBOX_API_KEY = env("MAPBOX_TOKEN");
const GOOGLE_API_KEY = env("GOOGLE_API_KEY");

export const getPointsByTrip = async (tripId: string, status?: string) => {
  const cacheKey = `points:${tripId}:${status ?? "all"}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    const parsed = JSON.parse(cached);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  }

  const query: any = { tripId };
  if (status) query.status = status;

  const points = await Point.find(query);
  if (points.length > 0) {
    await redisClient.set(cacheKey, JSON.stringify(points), { EX: 3600 });
  }

  return points;
};

export const createPoint = (data: any) => Point.create(data);

export const deletePointById = (id: string) => Point.findByIdAndDelete(id);

export const searchPlacesByText = async (query: string) => {
  const hashKey = "places:search";
  const field = query.toLowerCase().trim();

  const cached = await redisClient.hGet(hashKey, field);
  if (cached) return JSON.parse(cached);

  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
    query
  )}&inputtype=textquery&fields=name,geometry&key=${GOOGLE_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch from Google Places API");

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

export const updatePointById = async (id: string, data: any) => {
  const updated = await Point.findByIdAndUpdate(id, data, { new: true });
  return updated;
};

export async function getDistanceDuration(from: any, to: any, mode: string) {
  if (mode === "plane") {
    const distance = haversineDistance(from.lat, from.lng, to.lat, to.lng);
    const averagePlaneSpeed = 800_000 / 3600;
    const duration = distance / averagePlaneSpeed;
    return { distance, duration };
  }

  const profile =
    {
      car: "driving",
      walk: "walking",
      public: "driving",
      train: "driving",
      bike: "cycling",
      boat: "driving",
      taxi: "driving",
      bus: "driving",
    }[mode] || "driving";

  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${from.lng},${from.lat};${to.lng},${to.lat}?geometries=geojson&access_token=${MAPBOX_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Mapbox request failed");

  const json = await response.json();
  const route = json.routes?.[0];
  return {
    distance: route?.distance ?? 0,
    duration: route?.duration ?? 0,
  };
}
