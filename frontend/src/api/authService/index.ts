import { clientFetch } from '../clientFetch';
import { router } from '../../router';
import {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  RegistrationResponse,
  UserRefreshTokensResponse
} from '../../types';

export const TOKEN_KEY = 'token';

class AuthService {
  private token: string | null = null;

  constructor() {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken) {
      this.token = savedToken;
      clientFetch.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }

  isLoggedIn(): boolean {
    return Boolean(this.token);
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    clientFetch.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    this.token = token;
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem(TOKEN_KEY);
    clientFetch.defaults.headers.common['Authorization'] = '';
  }

  async login(body: LoginRequest): Promise<void> {
    const { data } = await clientFetch.post<LoginResponse>('/user/login', body);
    this.setToken(data.accessToken);
  }

  async registerUser(body: RegistrationRequest): Promise<void> {
    const { data } = await clientFetch.post<RegistrationResponse>('/user/register', body);
    this.setToken(data.accessToken);
  }

  async logout(): Promise<void> {
    await clientFetch.get<void>('/user/logout');
    this.clearToken();
  }

  async refresh(): Promise<void> {
    const { data } = await clientFetch.get<UserRefreshTokensResponse>('/user/refresh');
    this.setToken(data.accessToken);
  }
}

export const authService = new AuthService();

clientFetch.interceptors.request.use((request) => {
  const token = authService.getToken();

  if (token) {
    request.headers = request.headers || {};
    request.headers['Authorization'] = `Bearer ${token}`;
  }

  return request;
});

clientFetch.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorCode = error.response?.status;

    if (errorCode === 401) {
      try {
        await authService.refresh();
        error.config.headers['Authorization'] = `Bearer ${authService.getToken()}`;
        return clientFetch.request(error.config);
      } catch (e) {
        authService.clearToken();
        router.push('/auth/login');
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);
