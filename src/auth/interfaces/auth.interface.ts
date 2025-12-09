export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface SignUpDto {
  email: string;
  password: string;
  name: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Omit<User, 'password'>;
}
