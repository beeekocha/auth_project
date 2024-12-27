export interface CreateUserPayload {
  email: string;
  name: string;
  hashedPassword: string;
  salt: string;
}
