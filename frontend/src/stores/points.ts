import { defineStore } from 'pinia';
import {
  getPoints,
  addPoints,
  updatePoint,
  deletePoint,
  reorderPoints,
  getPointsByCategory,
  addNoteToPoint,
  getPointNotes,
  deleteNoteFromPoint
} from '../api/points/points';
import type { Point, AddPointRequest, UpdatePointRequest, PointNote } from '../types';

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

    async reorderPoints(tripId: string, newOrder: string[]) {
      try {
        await reorderPoints(tripId, newOrder);
        await this.fetchPoints(tripId);
      } catch (err) {
        console.error(err);
      }
    },

    async filterByCategory(tripId: string, category: string) {
      this.loading = true;
      try {
        this.points = await getPointsByCategory(tripId, category);
        this.sortPointsByOrder();
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async addNoteToPoint(pointId: string, text: string, tripId: string) {
      try {
        await addNoteToPoint(pointId, text, tripId);
      } catch (err) {
        console.error('❌ Failed to add note:', err);
        throw err;
      }
    },

    async fetchPointNotes(pointId: string): Promise<PointNote[]> {
      try {
        return await getPointNotes(
          pointId,
          this.points.find((p) => p._id === pointId)?.tripId || ''
        );
      } catch (err) {
        console.error('❌ Failed to fetch notes:', err);
        throw err;
      }
    },

    async removeNote(pointId: string, noteIndex: number): Promise<PointNote[]> {
      try {
        return await deleteNoteFromPoint(
          pointId,
          noteIndex,
          this.points.find((p) => p._id === pointId)?.tripId || ''
        );
      } catch (err) {
        console.error('❌ Failed to delete note:', err);
        throw err;
      }
    },
    sortPointsByOrder() {
      this.points.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    },

    clearPoints() {
      this.points = [];
    }
  }
});
