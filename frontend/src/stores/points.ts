import { defineStore } from 'pinia';
import {
  getFavoritePlaces,
  addFavoritePlace,
  deleteFavoritePlace,
  updateFavoritePlace
} from '../api/favorite-places';
import type { Point, AddPointRequest, UpdatePointRequest } from '../types';

export const usePointsStore = defineStore('points', {
  state: () => ({
    points: [] as Point[],
    loading: false
  }),

  actions: {
    async fetchPoints(tripId?: string) {
      this.loading = true;
      try {
        this.points = await getFavoritePlaces(tripId);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async addPoint(data: AddPointRequest) {
      await addFavoritePlace(data);
      await this.fetchPoints(data.tripId);
    },

    async updatePoint(data: UpdatePointRequest) {
      await updateFavoritePlace(data);
      await this.fetchPoints(data.tripId);
    },

    async deletePoint(id: string, tripId: string) {
      await deleteFavoritePlace(id, tripId);
      await this.fetchPoints(tripId);
    }
  }
});
