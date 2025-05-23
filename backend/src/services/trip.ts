import { Trip } from "../db/models/Trip";
import { Point } from "../db/models/Point";

export const createTrip = (data: any) => Trip.create(data);

export const getTripsByUser = (userId: string) =>
  Trip.find({ userId }).sort({ startDate: 1 });

export const getTripById = (id: string) => Trip.findById(id);

export const updateTripById = (userId: string, id: string, data: any) =>
  Trip.findOneAndUpdate({ _id: id, userId }, data, { new: true });

export const deleteTripById = async (userId: string, id: string) => {
  const trip = await Trip.findOne({ _id: id, userId });

  if (!trip) return null;

  await Point.deleteMany({ tripId: trip._id });

  return Trip.findByIdAndDelete(id);
};

export const inviteCollaborator = (tripId: string, userId: string) =>
  Trip.findByIdAndUpdate(
    tripId,
    { $addToSet: { collaborators: userId } },
    { new: true }
  );
