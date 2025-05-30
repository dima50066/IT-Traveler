export interface Point {
  _id: string;
  tripId: string;
  userId: string;
  coordinates: { lat: number; lng: number };
  title: string;
  notes?: string;
  dayNumber?: number;
  orderIndex?: number;
  transportMode?:
    | 'car'
    | 'walk'
    | 'public'
    | 'plane'
    | 'train'
    | 'bike'
    | 'boat'
    | 'taxi'
    | 'shuttle';
  category?:
    | 'accommodation'
    | 'airport'
    | 'restaurant'
    | 'museum'
    | 'nature'
    | 'shopping'
    | 'station'
    | 'other';
  distanceFromPrevious?: number;
  durationFromPrevious?: number;
  costFromPrevious?: number;
  img?: string;
  createdAt: string;
  updatedAt: string;
}

export type GetAllPointsResponse = Point[];

export interface AddPointRequest {
  title: string;
  notes?: string;
  coordinates: { lat: number; lng: number };
  tripId: string;
  dayNumber?: number;
  orderIndex?: number;
  transportMode?: Point['transportMode'];
  category?: Point['category'];
  costFromPrevious?: number;
  file?: File;
}

export interface UpdatePointRequest {
  id: string;
  title: string;
  notes?: string;
  coordinates: { lat: number; lng: number };
  tripId: string;
  dayNumber?: number;
  orderIndex?: number;
  transportMode?: Point['transportMode'];
  category?: Point['category'];
  costFromPrevious?: number;
  file?: File;
}

export interface DeletePointRequest {
  id: string;
  tripId: string;
}

export interface UpdateTripStatusRequest {
  tripId: string;
  status: 'planned' | 'in_progress' | 'completed';
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

export type UpdateTripRequest = Partial<CreateTripRequest> & {
  status?: 'planned' | 'in_progress' | 'completed';
};

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

// CHAT

export interface ChatMessage {
  messageId: string;
  tripId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

export interface GroupChatMessage extends ChatMessage {
  groupId: string;
}
