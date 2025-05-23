import { clientFetch } from '../clientFetch';
import { GetAllPointsResponse, AddPointRequest, UpdatePointRequest, Point } from '../../types';

const BASE_PLACES_URL = '/points';

export const getFavoritePlaces = (tripId?: string): Promise<Point[]> => {
  const query = tripId ? `?tripId=${tripId}` : '';
  const url = `/points/list${query}`;

  return clientFetch
    .get<GetAllPointsResponse>(url)
    .then(({ data }) => {
      return data.map((place) => ({
        ...place,
        id: place._id
      }));
    })
    .catch((err) => {
      throw err;
    });
};

export const addFavoritePlace = (body: AddPointRequest & { file?: File }): Promise<Point> => {
  const formData = new FormData();
  formData.append('title', body.title);
  formData.append('description', body.description);
  formData.append('coordinates[0]', body.coordinates[0].toString());
  formData.append('coordinates[1]', body.coordinates[1].toString());
  formData.append('tripId', body.tripId);

  if (body.status) {
    formData.append('status', body.status);
  }

  if (body.file) {
    formData.append('image', body.file);
  }

  return clientFetch.post<Point>(BASE_PLACES_URL, formData).then(({ data }) => data);
};

export const updateFavoritePlace = (body: UpdatePointRequest & { file?: File }): Promise<Point> => {
  const formData = new FormData();
  formData.append('title', body.title);
  formData.append('description', body.description);
  formData.append('coordinates[0]', body.coordinates[0].toString());
  formData.append('coordinates[1]', body.coordinates[1].toString());
  formData.append('tripId', body.tripId);

  if (body.status) {
    formData.append('status', body.status);
  }

  if (body.file) {
    formData.append('image', body.file);
  }

  return clientFetch.put<Point>(`${BASE_PLACES_URL}/${body.id}`, formData).then(({ data }) => data);
};

export const deleteFavoritePlace = (id: string, tripId: string): Promise<void> => {
  if (!tripId) {
    throw new Error('[deleteFavoritePlace] tripId is MISSING');
  }

  const fullUrl = `${BASE_PLACES_URL}/${id}`;

  return clientFetch.delete(fullUrl, {
    params: { tripId }
  });
};

export const searchPlaces = (
  query: string
): Promise<{ name: string; location: { lat: number; lng: number } }[]> => {
  return clientFetch
    .get(`/points/search?query=${encodeURIComponent(query)}`)
    .then((res) => res.data);
};
