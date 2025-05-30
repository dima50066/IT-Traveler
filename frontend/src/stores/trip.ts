import { defineStore } from 'pinia';
import { getTrips, createTrip, updateTrip, deleteTrip, inviteUserToTrip } from '../api/trip/trip';
import type { Trip, CreateTripRequest, UpdateTripRequest, InviteUserRequest } from '../types';

interface Notification {
  message: string;
  tripId: string;
  timestamp: string;
}

export const useTripsStore = defineStore('trips', {
  state: () => ({
    trips: [] as Trip[],
    loading: false,
    activeTrip: null as Trip | null,
    notifications: [] as Notification[],
    tripChatIds: {} as Record<string, string>
  }),

  getters: {
    activeTripId: (state) => state.activeTrip?._id ?? null,
    activeTripChatId: (state) => (state.activeTrip ? state.tripChatIds[state.activeTrip._id] : null)
  },

  actions: {
    async fetchTrips() {
      this.loading = true;
      try {
        this.trips = await getTrips();
      } finally {
        this.loading = false;
      }
    },

    setActiveTrip(trip: Trip | null) {
      this.activeTrip = trip;
    },

    setActiveTripChatId(tripId: string, chatId: string) {
      this.tripChatIds[tripId] = chatId;
    },

    async create(data: CreateTripRequest) {
      const newTrip = await createTrip(data);
      await this.fetchTrips();
      return newTrip;
    },

    async update(id: string, data: UpdateTripRequest) {
      await updateTrip(id, data);
      await this.fetchTrips();
    },

    async remove(id: string) {
      await deleteTrip(id);
      await this.fetchTrips();
    },

    async invite(tripId: string, data: InviteUserRequest) {
      await inviteUserToTrip(tripId, data);
      await this.fetchTrips();
    },

    addNotification(message: string, tripId: string) {
      this.notifications.push({ message, tripId, timestamp: new Date().toISOString() });
    },

    clearNotifications() {
      this.notifications = [];
    }
  }
});
