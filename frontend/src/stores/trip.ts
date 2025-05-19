import { defineStore } from 'pinia';
import { getTrips, createTrip, updateTrip, deleteTrip, inviteUserToTrip } from '../api/trip/trip';
import type { Trip, CreateTripRequest, UpdateTripRequest, InviteUserRequest } from '../types';

export const useTripsStore = defineStore('trips', {
  state: () => ({
    trips: [] as Trip[],
    loading: false
  }),

  actions: {
    async fetchTrips() {
      this.loading = true;
      try {
        this.trips = await getTrips();
      } finally {
        this.loading = false;
      }
    },

    async create(data: CreateTripRequest) {
      await createTrip(data);
      await this.fetchTrips();
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
    }
  }
});
