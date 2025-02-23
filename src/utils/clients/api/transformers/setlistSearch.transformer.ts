import { setlistTransformer } from './setlist.transformer';

import type { Setlist } from 'utils/types/setlist';

export function setlistSearchTransformer(raw: any) {
  const results = raw?.setlist?.map(setlistTransformer);

  return {
    page: raw.page ? parseInt(raw.page) : 1,
    totalPages: raw.total ? Math.ceil(parseInt(raw.total) / parseInt(raw.itemsPerPage)) : 1,
    results: results ?? ([] as Setlist[]),
  };
}
