import { clientFetch } from '../clientFetch';
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

  isLoggedIn(): boolean {
    return Boolean(this.token);
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

  async refresh(): Promise<UserRefreshTokensResponse> {
    const { data } = await clientFetch.get<UserRefreshTokensResponse>('/user/refresh');
    return data;
  }
}

export const authService = new AuthService();
