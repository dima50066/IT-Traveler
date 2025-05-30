import { defineStore } from 'pinia';
import {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  inviteUserToTrip,
  addTodoItem,
  reorderTodoList,
  markAllTodos,
  batchAddTodos,
  deleteTodoItem,
  updateTodoItem,
  toggleTodoItem
} from '../api/trip/trip';

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
    activeTripChatId: (state) =>
      state.activeTrip ? state.tripChatIds[state.activeTrip._id] : null,
    todoList: (state) => state.activeTrip?.todoList ?? []
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
    },

    async addTodo(tripId: string, text: string) {
      const updatedList = await addTodoItem(tripId, { text });
      const trip = this.trips.find((t) => t._id === tripId);
      if (trip) trip.todoList = updatedList;
    },

    async deleteTodo(tripId: string, todoId: string) {
      const updatedList = await deleteTodoItem(tripId, todoId);
      const trip = this.trips.find((t) => t._id === tripId);
      if (trip) trip.todoList = updatedList;
    },

    async updateTodo(tripId: string, todoId: string, data: { text?: string }) {
      const updatedList = await updateTodoItem(tripId, todoId, data);
      const trip = this.trips.find((t) => t._id === tripId);
      if (trip) trip.todoList = updatedList;
    },

    async reorderTodos(tripId: string, todoIds: string[]) {
      const updatedList = await reorderTodoList(tripId, { todoIds });
      const trip = this.trips.find((t) => t._id === tripId);
      if (trip) trip.todoList = updatedList;
    },

    async markAll(tripId: string, done: boolean) {
      const updatedList = await markAllTodos(tripId, { done });
      const trip = this.trips.find((t) => t._id === tripId);
      if (trip) trip.todoList = updatedList;
    },
    async clearCompleted(tripId: string) {
      const trip = this.trips.find((t) => t._id === tripId);
      if (!trip) return;

      const completedTodos = trip.todoList.filter((todo) => todo.done);

      for (const todo of completedTodos) {
        await this.deleteTodo(tripId, todo.id);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    },

    async batchAdd(tripId: string, items: string[]) {
      const updatedList = await batchAddTodos(tripId, { items });
      const trip = this.trips.find((t) => t._id === tripId);
      if (trip) trip.todoList = updatedList;
    },

    async toggleTodo(tripId: string, todoId: string) {
      const trip = this.trips.find((t) => t._id === tripId);
      const todoItem = trip?.todoList.find((item) => item.id === todoId);
      if (!todoItem) return;

      const updatedList = await toggleTodoItem(tripId, todoId);
      if (trip) trip.todoList = updatedList;
    }
  }
});
