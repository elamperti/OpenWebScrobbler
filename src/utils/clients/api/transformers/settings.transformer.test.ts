import { settingsTransformer } from './settings.transformer';

describe('settingsTransformer', () => {
  it('applies defaults when values are missing', () => {
    expect(settingsTransformer(undefined)).toEqual({
      lang: 'auto',
      use12Hours: false,
      catchPaste: true,
      showTrackNumbers: false,
      hasActiveSubscription: false,
      keepOriginalTimestamp: true,
      patreonId: '',
    });
  });

  it('transforms provided settings correctly', () => {
    const raw = {
      lang: 'es',
      use12Hours: true,
      catchPaste: false,
      showTrackNumbers: true,
      activeSubscription: true,
      keepOriginalTimestamp: false,
      patreonId: '12345',
    };

    expect(settingsTransformer(raw)).toEqual({
      lang: 'es',
      use12Hours: true,
      catchPaste: false,
      showTrackNumbers: true,
      hasActiveSubscription: true,
      keepOriginalTimestamp: false,
      patreonId: '12345',
    });
  });
});
