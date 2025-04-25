import { clientFetch } from '../clientFetch';
import { GetAllPointsResponse, AddPointRequest, UpdatePointRequest, Point } from '../../types';

const BASE_PLACES_URL = '/points';

export const getFavoritePlaces = (): Promise<GetAllPointsResponse> => {
  return clientFetch.get(BASE_PLACES_URL);
};

export const addFavoritePlace = (body: AddPointRequest): Promise<Point> => {
  return clientFetch.post(BASE_PLACES_URL, body);
};

export const updateFavoritePlace = (body: UpdatePointRequest): Promise<Point> => {
  return clientFetch.put(BASE_PLACES_URL, body);
};

export const deleteFavoritePlace = (body: { id: string }): Promise<void> => {
  return clientFetch.delete(BASE_PLACES_URL, { data: body });
};
