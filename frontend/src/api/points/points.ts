import { clientFetch } from '../clientFetch';
import {
  GetAllPointsResponse,
  AddPointRequest,
  UpdatePointRequest,
  Point,
  PointNote
} from '../../types';

const BASE_PLACES_URL = '/points';

export const getPoints = (tripId?: string): Promise<Point[]> => {
  const query = tripId ? `?tripId=${tripId}` : '';
  const url = `/points/list${query}`;

  return clientFetch.get<GetAllPointsResponse>(url).then(({ data }) => {
    return data.map((place) => ({
      ...place,
      id: place._id
    }));
  });
};

export const addPoints = (body: AddPointRequest): Promise<Point> => {
  const formData = new FormData();

  formData.append('title', body.title);
  formData.append('coordinates[lat]', String(body.coordinates?.lat ?? 0));
  formData.append('coordinates[lng]', String(body.coordinates?.lng ?? 0));
  formData.append('tripId', body.tripId);

  if (body.description) formData.append('description', body.description);
  if (body.dayNumber != null) formData.append('dayNumber', String(body.dayNumber));
  if (body.orderIndex != null) formData.append('orderIndex', String(body.orderIndex));
  if (body.transportMode) formData.append('transportMode', body.transportMode);
  if (body.category) formData.append('category', body.category);
  if (body.costFromPrevious != null)
    formData.append('costFromPrevious', String(body.costFromPrevious));
  if (body.file) formData.append('image', body.file);

  return clientFetch.post<Point>(BASE_PLACES_URL, formData).then(({ data }) => data);
};

export const updatePoint = (body: UpdatePointRequest): Promise<Point> => {
  const formData = new FormData();
  formData.append('title', body.title);
  formData.append('coordinates[lat]', String(body.coordinates?.lat ?? 0));
  formData.append('coordinates[lng]', String(body.coordinates?.lng ?? 0));
  formData.append('tripId', body.tripId);

  if (body.description) formData.append('description', body.description);
  if (body.dayNumber != null) formData.append('dayNumber', String(body.dayNumber));
  if (body.orderIndex != null) formData.append('orderIndex', String(body.orderIndex));
  if (body.transportMode) formData.append('transportMode', body.transportMode);
  if (body.category) formData.append('category', body.category);
  if (body.costFromPrevious != null)
    formData.append('costFromPrevious', String(body.costFromPrevious));
  if (body.file) formData.append('image', body.file);

  return clientFetch.put<Point>(`${BASE_PLACES_URL}/${body.id}`, formData).then(({ data }) => data);
};

export const deletePoint = (id: string, tripId: string): Promise<void> => {
  if (!tripId) {
    throw new Error('[deleteFavoritePlace] tripId is MISSING');
  }

  const fullUrl = `${BASE_PLACES_URL}/${id}`;
  return clientFetch.delete(fullUrl, { params: { tripId } });
};

export const searchPlaces = (
  query: string
): Promise<{ name: string; location: { lat: number; lng: number } }[]> => {
  return clientFetch
    .get(`/points/search?query=${encodeURIComponent(query)}`)
    .then((res) => res.data);
};

export const reorderPoints = (tripId: string, orderedPointIds: string[]): Promise<void> => {
  return clientFetch.patch(`/points/reorder/${tripId}`, { orderedPointIds }); // ✅
};

export const getPointsByCategory = (tripId: string, category: string): Promise<Point[]> => {
  return clientFetch
    .get(`/trips/${tripId}/points`, { params: { category } })
    .then((res) => res.data);
};

export const addNoteToPoint = (
  pointId: string,
  text: string,
  tripId: string
): Promise<PointNote> => {
  return clientFetch
    .patch(`${BASE_PLACES_URL}/${pointId}/notes?tripId=${tripId}`, { text })
    .then((res) => res.data);
};

export const getPointNotes = (pointId: string, tripId: string): Promise<PointNote[]> => {
  return clientFetch
    .get(`/points/${pointId}/notes`, { params: { tripId } })
    .then((res) => res.data);
};

export const deleteNoteFromPoint = (
  pointId: string,
  noteIndex: number,
  tripId: string
): Promise<PointNote[]> => {
  return clientFetch
    .delete(`/points/${pointId}/notes/${noteIndex}`, { params: { tripId } })
    .then((res) => res.data.notes);
};
