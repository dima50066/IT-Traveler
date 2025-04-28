import { clientFetch } from '../clientFetch';
import {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  RegistrationResponse,
  UserRefreshTokensResponse,
  UserInfo
} from '../../types';

export const login = (body: LoginRequest): Promise<LoginResponse> => {
  return clientFetch.post('/user/login', body);
};

export const registerUser = (body: RegistrationRequest): Promise<RegistrationResponse> => {
  return clientFetch.post('/user/register', body);
};

export const logout = (): Promise<void> => {
  return clientFetch.get('/user/logout');
};

export const refresh = (): Promise<UserRefreshTokensResponse> => {
  return clientFetch.get('/user/refresh');
};

export const getUserInfo = (): Promise<UserInfo> => {
  return clientFetch.get('/user/me');
};
