import { Point } from "../db/models/Point";

export const getPointsByUser = (userId: string) => Point.find({ userId });

export const createPoint = (data: any) => Point.create(data);

export const updateUserPointById = (userId: string, id: string, data: any) =>
  Point.findOneAndUpdate({ _id: id, userId }, data, { new: true });

export const deleteUserPointById = (userId: string, id: string) =>
  Point.findOneAndDelete({ _id: id, userId });
