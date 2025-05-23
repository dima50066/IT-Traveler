export interface Point {
  _id: string;
  title: string;
  description: string;
  img: string;
  coordinates: [number, number];
  status: 'wishlist' | 'visited';
  tripId: string;
}

export type GetAllPointsResponse = Point[];

export interface AddPointRequest {
  title: string;
  description: string;
  coordinates: [number, number];
  status?: 'wishlist' | 'visited';
  tripId: string;
  file?: File;
}

export interface UpdatePointRequest {
  id: string;
  title: string;
  description: string;
  img: string;
  coordinates: [number, number];
  status?: 'wishlist' | 'visited';
  tripId: string;
}

// TRIPS

export interface Trip {
  _id: string;
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'completed';
  userId: string;
  collaborators: string[];
  chatId?: string;
  budget: {
    transport: number;
    accommodation: number;
    food: number;
    other: number;
  };
  todoList: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status?: 'planned' | 'in_progress' | 'completed';
  collaborators?: string[];
  todoList?: string[];
  budget?: {
    transport?: number;
    accommodation?: number;
    food?: number;
    other?: number;
  };
}

export type UpdateTripRequest = Partial<CreateTripRequest>;

export interface InviteUserRequest {
  userId: string;
}

// USER
export interface User {
  _id: string;
  googleId: string;
  email: string;
  name: string;
  picture: string;
  role: string;
}
