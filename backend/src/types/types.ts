export interface AuthenticatedUser {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}
