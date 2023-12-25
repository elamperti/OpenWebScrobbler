import { Pane } from 'tweakpane';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    __PaneInstance: Pane | null;
  }
}

type TweaksConfigItem = {
  name: string;
  type?: 'binding' | 'button';
  value: any;
  options?: any;
};

export interface TweaksConfig {
  pane?: {
    initialPosition?:
      | {
          left: string;
          right?: undefined;
          top: string;
        }
      | {
          left?: undefined;
          right: string;
          top: string;
        };
    expanded: Boolean;
  };
  params: {
    [key: string]: {
      tweaks: TweaksConfigItem[];
      options?: any;
    };
  };
}
