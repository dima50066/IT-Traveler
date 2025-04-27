import { clientFetch } from '../clientFetch';
import { GetAllPointsResponse, AddPointRequest, UpdatePointRequest, Point } from '../../types';

const BASE_PLACES_URL = '/points';

// Отримання улюблених місць з мапінгом id
export const getFavoritePlaces = (): Promise<Point[]> => {
  return clientFetch.get<GetAllPointsResponse>(BASE_PLACES_URL).then(({ data }) =>
    data.map((place) => ({
      ...place,
      id: place._id
    }))
  );
};

// Додавання улюбленого місця
export const addFavoritePlace = (body: AddPointRequest): Promise<Point> => {
  return clientFetch.post<Point>(BASE_PLACES_URL, body).then(({ data }) => data);
};

// Оновлення улюбленого місця
export const updateFavoritePlace = (body: UpdatePointRequest): Promise<Point> => {
  return clientFetch.put<Point>(BASE_PLACES_URL, body).then(({ data }) => data);
};

// Видалення улюбленого місця
export const deleteFavoritePlace = (body: { id: string }): Promise<void> => {
  return clientFetch.delete(BASE_PLACES_URL, { data: body });
};
