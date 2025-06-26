import alertReducer from './alertReducer';

import { ALERT_CLEAR_ALL, ALERT_CREATE, ALERT_DISMISS } from 'Constants';

import type { Alert } from 'components/AlertZone/types';

describe('alertReducer', () => {
  it('creates alerts with generated ids', () => {
    const state = alertReducer([], {
      type: ALERT_CREATE,
      payload: { message: 'Hello world' },
    });
    expect(state).toHaveLength(1);
    expect(state[0]).toMatchObject({ message: 'Hello world', persistent: false });
    expect(state[0].id).toBeDefined();
  });

  it('dismisses alerts matching payload properties', () => {
    const initial: Alert[] = [
      { id: '1', message: 'a', title: '', type: 'info', persistent: false },
      { id: '2', message: 'b', title: '', type: 'info', persistent: false },
    ];
    const state = alertReducer(initial, {
      type: ALERT_DISMISS,
      payload: { id: '1' },
    });
    expect(state).toEqual([{ id: '2', message: 'b', title: '', type: 'info', persistent: false }]);
  });

  it('clears non persistent alerts', () => {
    const initial: Alert[] = [
      { id: '1', message: 'a', title: '', type: 'info', persistent: false },
      { id: '2', message: 'b', title: '', type: 'info', persistent: true },
    ];
    const state = alertReducer(initial, { type: ALERT_CLEAR_ALL });
    expect(state).toEqual([{ id: '2', message: 'b', title: '', type: 'info', persistent: true }]);
  });
});
