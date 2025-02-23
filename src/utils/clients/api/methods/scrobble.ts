import { openscrobblerAPI } from '../apiClient';
import { prepareScrobbles } from 'store/transformers/scrobbleTransformer';

// Helper function to convert object with arrays to URLSearchParams
// (this will be removed after upgrading the endpoint)
function formEncode(data): URLSearchParams {
  const params = new URLSearchParams();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      data[key].forEach((item: any) => params.append(`${key}[]`, item.toString()));
    } else {
      params.append(key, data[key].toString());
    }
  }
  return params;
}

export function scrobble(scrobbles: any, scrobbleUUID: string) {
  const formEncodedPayload = formEncode(prepareScrobbles(scrobbles));

  return openscrobblerAPI.post('/scrobble.php', formEncodedPayload, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      scrobbleUUID,
    },
  });
}
