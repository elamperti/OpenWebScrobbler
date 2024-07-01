import type { Pane } from 'tweakpane';

import { BindingApi } from '@tweakpane/core';


declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    __PaneInstance: Pane | null;
    __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
  }
}

type TweaksConfigItem<T = any> = {
  name: string;
  type?: 'binding' | 'button' | 'monitor';
  value: T;
  onChange?: (tweakPaneItem: BindingApi, value: T) => void;
  onMount?: (tweakPaneItem: BindingApi, self: TweaksConfigItem) => void;
  options?: {
    reload?: boolean;
    hidden?: boolean;
    disabled?: boolean;
  };
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
    };
  };
}
