import { clientFetch } from '../clientFetch';
import { User } from '../../types';

export const fetchOrCreateUser = async (token: string) => {
  const { data } = await clientFetch.get('/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return data.user;
};

export const fetchAllUsers = async (token: string): Promise<User[]> => {
  const { data } = await clientFetch.get<{ users: User[] }>('/auth/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return data.users;
};
