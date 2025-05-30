import { clientFetch } from '../clientFetch';
import type {
  Trip,
  CreateTripRequest,
  UpdateTripRequest,
  InviteUserRequest,
  UpdateTripStatusRequest,
  AddTodoRequest,
  UpdateTodoRequest,
  ReorderTodosRequest,
  MarkAllTodosRequest,
  BatchAddTodosRequest,
  TodoItem
} from '../../types';

const BASE_TRIPS_URL = '/trip';

export const getTrips = (): Promise<Trip[]> => {
  return clientFetch.get<Trip[]>(BASE_TRIPS_URL).then(({ data }) =>
    data.map((trip) => ({
      ...trip,
      id: trip._id
    }))
  );
};

export const createTrip = (body: CreateTripRequest): Promise<Trip> => {
  return clientFetch.post<Trip>(BASE_TRIPS_URL, body).then(({ data }) => ({
    ...data,
    id: data._id
  }));
};

export const updateTrip = (id: string, body: UpdateTripRequest): Promise<Trip> => {
  return clientFetch.put<Trip>(`${BASE_TRIPS_URL}/${id}`, body).then(({ data }) => ({
    ...data,
    id: data._id
  }));
};

export const deleteTrip = (id: string): Promise<void> => {
  return clientFetch.delete(`${BASE_TRIPS_URL}/${id}`);
};

export const inviteUserToTrip = (tripId: string, body: InviteUserRequest): Promise<Trip> => {
  return clientFetch.patch<Trip>(`${BASE_TRIPS_URL}/${tripId}/invite`, body).then(({ data }) => ({
    ...data,
    id: data._id
  }));
};

export const updateTripStatus = (body: UpdateTripStatusRequest): Promise<Trip> => {
  return clientFetch
    .patch<Trip>(`${BASE_TRIPS_URL}/${body.tripId}`, { status: body.status })
    .then(({ data }) => ({
      ...data,
      id: data._id
    }));
};

export const addTodoItem = (tripId: string, body: AddTodoRequest): Promise<TodoItem[]> => {
  return clientFetch
    .patch<TodoItem[]>(`${BASE_TRIPS_URL}/${tripId}/todo/add`, body)
    .then((res) => res.data);
};

export const toggleTodoItem = (tripId: string, todoId: string): Promise<TodoItem[]> => {
  return clientFetch
    .patch<TodoItem[]>(`${BASE_TRIPS_URL}/${tripId}/todo/${todoId}/toggle`)
    .then((res) => res.data);
};

export const deleteTodoItem = (tripId: string, todoId: string): Promise<TodoItem[]> => {
  return clientFetch
    .delete<TodoItem[]>(`${BASE_TRIPS_URL}/${tripId}/todo/${todoId}`)
    .then((res) => res.data);
};

export const updateTodoItem = (
  tripId: string,
  todoId: string,
  body: UpdateTodoRequest
): Promise<TodoItem[]> => {
  return clientFetch
    .patch<TodoItem[]>(`${BASE_TRIPS_URL}/${tripId}/todo/${todoId}`, body)
    .then((res) => res.data);
};

export const reorderTodoList = (tripId: string, body: ReorderTodosRequest): Promise<TodoItem[]> => {
  return clientFetch
    .patch<TodoItem[]>(`${BASE_TRIPS_URL}/${tripId}/todo/reorder`, body)
    .then((res) => res.data);
};

export const markAllTodos = (tripId: string, body: MarkAllTodosRequest): Promise<TodoItem[]> => {
  return clientFetch
    .patch<TodoItem[]>(`${BASE_TRIPS_URL}/${tripId}/todo/mark-all`, body)
    .then((res) => res.data);
};

export const batchAddTodos = (tripId: string, body: BatchAddTodosRequest): Promise<TodoItem[]> => {
  return clientFetch
    .post<TodoItem[]>(`${BASE_TRIPS_URL}/${tripId}/todo/batch`, body)
    .then((res) => res.data);
};
