import { clientFetch } from '../clientFetch';
import { GetAllPointsResponse, AddPointRequest, UpdatePointRequest, Point } from '../../types';

const BASE_PLACES_URL = '/points';

export const getFavoritePlaces = (): Promise<Point[]> => {
  return clientFetch.get<GetAllPointsResponse>(BASE_PLACES_URL).then(({ data }) =>
    data.map((place) => ({
      ...place,
      id: place._id
    }))
  );
};

export const addFavoritePlace = (body: AddPointRequest & { file?: File }): Promise<Point> => {
  const formData = new FormData();
  formData.append('title', body.title);
  formData.append('description', body.description);
  formData.append('coordinates[0]', body.coordinates[0].toString());
  formData.append('coordinates[1]', body.coordinates[1].toString());

  if (body.file) {
    formData.append('image', body.file);
  }

  return clientFetch.post<Point>(BASE_PLACES_URL, formData).then(({ data }) => data);
};

export const updateFavoritePlace = (body: UpdatePointRequest & { id: string }): Promise<Point> => {
  const { id, ...updateData } = body;
  return clientFetch.put<Point>(`${BASE_PLACES_URL}/${id}`, updateData).then(({ data }) => data);
};

export const deleteFavoritePlace = (id: string): Promise<void> => {
  return clientFetch.delete(`${BASE_PLACES_URL}/${id}`);
};

export const searchPlaces = (
  query: string
): Promise<{ name: string; location: { lat: number; lng: number } }[]> => {
  return clientFetch
    .get(`/points/search?query=${encodeURIComponent(query)}`)
    .then((res) => res.data);
};
