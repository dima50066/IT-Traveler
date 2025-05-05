import { clientFetch } from '../clientFetch';
import { useAuth0 } from '@auth0/auth0-vue';

export const fetchOrCreateUser = async () => {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();

  const { data } = await clientFetch.get('/auth/callback', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return data.user;
};

export const fetchUserProfile = async () => {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();

  const { data } = await clientFetch.get('/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return data.user;
};
