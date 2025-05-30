import { useTripsStore } from '../stores/trip';
import { usePointsStore } from '../stores/points';
import type { Trip } from '../types';
import { connectSocket, disconnectSocket } from '../api/socket';

export function useTripLifecycle() {
  const tripStore = useTripsStore();
  const pointStore = usePointsStore();

  async function selectTrip(trip: Trip) {
    tripStore.setActiveTrip(trip);
    await pointStore.fetchPoints(trip._id);
    connectSocket(trip._id);
  }

  function clearTrip() {
    tripStore.setActiveTrip(null);
    pointStore.points = [];
    disconnectSocket();
  }

  return { selectTrip, clearTrip };
}
