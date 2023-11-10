export type AvatarSizes = 'xl' | 'lg' | 'md' | 'sm';

export type Avatar =
  | {
      [key in AvatarSizes]: string;
    }
  | null;
