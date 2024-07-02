import { get } from 'lodash-es';
import { Settings } from 'utils/types/settings';


export function settingsTransformer(settings = {}): Settings {
  return {
    lang: get(settings, 'lang', 'auto'),
    use12Hours: !!get(settings, 'use12Hours', false),
    catchPaste: !!get(settings, 'catchPaste', true),
    showTrackNumbers: !!get(settings, 'showTrackNumbers', false),
    isDonor: !!get(settings, 'isDonor', false),
    keepOriginalTimestamp: !!get(settings, 'keepOriginalTimestamp', true),
  };
}
