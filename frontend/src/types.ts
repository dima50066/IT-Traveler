export interface Point {
  _id: string;
  title: string;
  description: string;
  img: string;
  coordinates: [number, number];
}

export type GetAllPointsResponse = Point[];

export interface AddPointRequest {
  title: string;
  description: string;
  coordinates: [number, number];
  file?: File;
}

export interface UpdatePointRequest {
  id: string;
  title: string;
  description: string;
  img: string;
  coordinates: [number, number];
}
