export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData extends SignInData {
  name: string;
}

export interface User {
  email: string;
  name: string;
}

export interface AuthResponse {
  jwt: string;
}
