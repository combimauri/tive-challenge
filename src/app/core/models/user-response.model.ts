import { User } from './user.model';

export interface UserResponse {
  items: User[];
  hasMore: boolean;
  pageNumber: number;
  itemsPerPage: number;
}
