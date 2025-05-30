import { clientFetch } from '../clientFetch';
import type {
  Trip,
  CreateTripRequest,
  UpdateTripRequest,
  InviteUserRequest,
  UpdateTripStatusRequest
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
