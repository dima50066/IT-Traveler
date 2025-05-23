import { clientFetch } from '../clientFetch';

export const fetchOrCreateUser = async (token: string) => {
  const { data } = await clientFetch.get('/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return data.user;
};
