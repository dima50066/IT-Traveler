import { Trip } from "../db/models/Trip";

export const createTrip = (data: any) => Trip.create(data);

export const getTripsByUser = (userId: string) =>
  Trip.find({ userId }).sort({ startDate: 1 });

export const getTripById = (id: string) => Trip.findById(id);

export const updateTripById = (userId: string, id: string, data: any) =>
  Trip.findOneAndUpdate({ _id: id, userId }, data, { new: true });

export const deleteTripById = (userId: string, id: string) =>
  Trip.findOneAndDelete({ _id: id, userId });

export const inviteCollaborator = (tripId: string, userId: string) =>
  Trip.findByIdAndUpdate(
    tripId,
    { $addToSet: { collaborators: userId } },
    { new: true }
  );

// export const getTripSummary = async (id: string) => {
//   const trip = await Trip.findById(id);
//   if (!trip) throw new Error("Trip not found");

//   return {
//     title: trip.title,
//     durationDays: Math.ceil(
//       (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
//         (1000 * 60 * 60 * 24)
//     ),
//     totalBudget:
//       trip.budget.transport +
//       trip.budget.accommodation +
//       trip.budget.food +
//       trip.budget.other,
//   };
// };
