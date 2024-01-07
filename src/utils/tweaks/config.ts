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
    'React DevTools': {
      tweaks: [
        {
          name: 'Highlight updates',
          value: false,
          onMount: (tweakItem, self) => {
            if (window && typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'function') {
              window.__REACT_DEVTOOLS_GLOBAL_HOOK__.on('react-devtools', (agent) => {
                // Enable the item once the devtools are connected
                tweakItem.disabled = false;

                if (self.value) {
                  setTimeout(() => {
                    agent.setTraceUpdatesEnabled(true);
                  }, 100); // ToDo: improve this
                }

                tweakItem.on('change', ({ value }) => {
                  agent.setTraceUpdatesEnabled(value);
                });
              });
            }
          },
          options: {
            disabled: true,
          },
        },
        {
          name: 'Renders',
          type: 'monitor',
          value: 0,
          onMount: (tweakItem, self) => {
            if (window && typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'function') {
              window.__REACT_DEVTOOLS_GLOBAL_HOOK__.on('traceUpdates', (updatedNodes: Set<any>) => {
                self.value = updatedNodes.size;
                tweakItem.refresh();
                self.value = 0;
                tweakItem.refresh();
              });
            }
          },
        },
      ],
    },
  },
};

export default config;
