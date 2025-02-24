interface UserResponseInterface {
  id: string;
  email: string;
  name: string;
}

export interface UserServiceInterface {
  getProfile(email: string): Promise<UserResponseInterface>;
}
