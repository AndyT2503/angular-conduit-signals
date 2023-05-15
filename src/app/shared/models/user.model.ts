export interface UserAPIResponse {
  user: User;
}
export interface User {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
}

export interface Author {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}