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

export const addFavoritePlace = (body: AddPointRequest): Promise<Point> => {
  return clientFetch.post<Point>(BASE_PLACES_URL, body).then(({ data }) => data);
};

export const updateFavoritePlace = (body: UpdatePointRequest & { id: string }): Promise<Point> => {
  const { id, ...updateData } = body;
  return clientFetch.put<Point>(`${BASE_PLACES_URL}/${id}`, updateData).then(({ data }) => data);
};

export const deleteFavoritePlace = (id: string): Promise<void> => {
  return clientFetch.delete(`${BASE_PLACES_URL}/${id}`);
};
