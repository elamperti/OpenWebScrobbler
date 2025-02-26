import type { Avatar } from './avatar';

export type User = {
  id: string;
  name: string;
  avatar: Avatar;
  url?: string;
};
