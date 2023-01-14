import { IconProp } from '@fortawesome/fontawesome-svg-core';

export type Alert = {
  id: string;
  type: 'danger' | 'success' | 'info' | 'warning';
  title: string;
  category?: string; // Used to avoid duplicates
  persistent: boolean;
  errorNumber?: number;
  message?: string;
  rawMessage?: string;
  icon?: IconProp;
};
