export interface User {
  userId: string;
  name: string;
  level: number;
  coins: number;
  time: number;
  score: number;
  country: string;
  friends?: string[];
}
