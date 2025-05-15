export interface Point {
  _id: string;
  title: string;
  description: string;
  img: string;
  coordinates: [number, number];
  status: 'wishlist' | 'visited';
}

export type GetAllPointsResponse = Point[];

export interface AddPointRequest {
  title: string;
  description: string;
  coordinates: [number, number];
  status?: 'wishlist' | 'visited';
  file?: File;
}

export interface UpdatePointRequest {
  id: string;
  title: string;
  description: string;
  img: string;
  coordinates: [number, number];
  status?: 'wishlist' | 'visited';
}
