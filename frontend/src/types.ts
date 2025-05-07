// UserAuth Types

export interface RegistrationRequest {
  name: string;
  password: string;
  email: string;
}

export interface RegistrationResponse {
  name: string;
  email: string;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface UserInfo {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRefreshTokensResponse {
  accessToken: string;
}

// Points Types

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
