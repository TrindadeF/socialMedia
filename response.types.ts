import { User } from 'database';

export interface LikesResponse {
  users: User[];
  content: string;
  likes: User[];
}
