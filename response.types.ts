import { User } from 'database';

export interface LikesResponse {
  content: string;
  likes: User[];
}
