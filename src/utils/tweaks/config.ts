import type { TweaksConfig } from './types';

import './quirks/hideReactQueryButton.css';

const config: TweaksConfig = {
  pane: {
    initialPosition: {
      top: '48px',
      right: '24px',
    },
    expanded: false,
  },
  params: {
    Sentry: {
      tweaks: [
        { name: 'Enabled', value: true, options: { reload: true } },
        { name: 'Debug', value: false, options: { reload: true } },
      ],
    },
    Analytics: { tweaks: [{ name: 'Debug', value: false }] },
    i18n: { tweaks: [{ name: 'Debug', value: false, options: { reload: true } }] },
    'React Query': {
      tweaks: [
        {
          name: 'Toggle panel',
          type: 'button',
          value: () => {
            document.getElementsByClassName('tsqd-parent-container')[0].querySelector('button').click();
          },
        },
      ],
    },
  },
};

export default config;
