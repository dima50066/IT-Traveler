import { useTripsStore } from '../stores/trip';
import { usePointsStore } from '../stores/points';
import type { Trip } from '../types';

export function useTripLifecycle() {
  const tripStore = useTripsStore();
  const pointStore = usePointsStore();

  async function selectTrip(trip: Trip) {
    tripStore.setActiveTrip(trip);
    await pointStore.fetchPoints(trip._id);
  }

  function clearTrip() {
    tripStore.setActiveTrip(null);
    pointStore.points = [];
  }

  return { selectTrip, clearTrip };
}
