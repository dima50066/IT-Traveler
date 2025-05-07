import { Point } from "../db/models/Point";
import { env } from "../utils/env";

const GOOGLE_API_KEY = env("GOOGLE_API_KEY");

export const getPointsByUser = (userId: string) => Point.find({ userId });

export const createPoint = (data: any) => Point.create(data);

export const updateUserPointById = (userId: string, id: string, data: any) =>
  Point.findOneAndUpdate({ _id: id, userId }, data, { new: true });

export const deleteUserPointById = (userId: string, id: string) =>
  Point.findOneAndDelete({ _id: id, userId });

export const searchPlacesByText = async (query: string) => {
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
    query
  )}&inputtype=textquery&fields=name,geometry&key=${GOOGLE_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch from Google Places API");
  }

  const data = await response.json();

  return (
    data.candidates?.map((candidate: any) => ({
      name: candidate.name,
      location: candidate.geometry?.location,
    })) || []
  );
};
