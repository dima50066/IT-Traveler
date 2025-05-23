import { defineStore } from 'pinia';
import { getPoints, addPoints, updatePoint, deletePoint } from '../api/points/points';
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
        this.points = await getPoints(tripId);
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async addPoint(data: AddPointRequest) {
      await addPoints(data);
      await this.fetchPoints(data.tripId);
    },

    async updatePoint(data: UpdatePointRequest) {
      await updatePoint(data);
      await this.fetchPoints(data.tripId);
    },

    async deletePoint(id: string, tripId: string) {
      await deletePoint(id, tripId);
      await this.fetchPoints(tripId);
    }
  }
});
