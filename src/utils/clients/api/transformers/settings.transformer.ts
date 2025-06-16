import type { Settings } from 'utils/types/settings';

export function settingsTransformer(settings = {}): Settings {
  return {
    lang: settings?.lang ?? 'auto',
    use12Hours: !!(settings?.use12Hours ?? false),
    catchPaste: !!(settings?.catchPaste ?? true),
    showTrackNumbers: !!(settings?.showTrackNumbers ?? false),
    hasActiveSubscription: !!(settings?.activeSubscription ?? false),
    keepOriginalTimestamp: !!(settings?.keepOriginalTimestamp ?? true),
    patreonId: settings?.patreonId ?? '',
  };
}
