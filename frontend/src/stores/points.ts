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
    async fetchPoints() {
      this.loading = true;
      try {
        this.points = await getFavoritePlaces();
      } finally {
        this.loading = false;
      }
    },

    async addPoint(data: AddPointRequest) {
      await addFavoritePlace(data);
      await this.fetchPoints();
    },

    async updatePoint(data: UpdatePointRequest) {
      await updateFavoritePlace(data);
      await this.fetchPoints();
    },

    async deletePoint(id: string) {
      await deleteFavoritePlace(id);
      await this.fetchPoints();
    }
  }
});
