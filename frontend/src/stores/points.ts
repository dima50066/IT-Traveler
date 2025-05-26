import { defineStore } from 'pinia';
import {
  getPoints,
  addPoints,
  updatePoint,
  deletePoint,
  reorderPoints,
  getPointsByCategory
} from '../api/points/points';
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
        this.sortPointsByOrder();
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
    },
    clearPoints() {
      this.points = [];
    },

    async reorderPoints(tripId: string, newOrder: string[]) {
      try {
        await reorderPoints(tripId, newOrder);
        await this.fetchPoints(tripId);
      } catch (err) {
        console.error('[reorderPoints] reorder failed:', err);
      }
    },

    async filterByCategory(tripId: string, category: string) {
      this.loading = true;
      try {
        this.points = await getPointsByCategory(tripId, category);
        this.sortPointsByOrder();
      } catch (err) {
        console.error('[filterByCategory] failed:', err);
      } finally {
        this.loading = false;
      }
    },

    sortPointsByOrder() {
      this.points.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    }
  }
});
