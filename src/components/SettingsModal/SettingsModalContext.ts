import { createContext } from 'react';

export const SettingsModalContext = createContext({
  isOpen: false,
  setSettingsModalVisible: (newValue: boolean) => {},
});
