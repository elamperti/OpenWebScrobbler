import shortid from 'shortid';
import type { Track } from 'utils/types/track';

export function tracksTransformer(
  response: any,
  options?: { album: string; artist: string; cover?: { sm: string; lg: string } | null }
): Track[] {
  const trackinfo = response?.data?.trackinfo;
  if (!Array.isArray(trackinfo) || trackinfo.length === 0) return [];

  const album = options?.album ?? '';
  const albumArtist = options?.artist ?? '';

  // checkCompilation: every title is "artist - title"
  const isCompilation = trackinfo.every((t) => typeof t.title === 'string' && t.title.includes(' - '));

  return trackinfo.map((track, index) => {
    let artist = albumArtist;
    let title = track.title || '';
    if (isCompilation) {
      const [a, ...rest] = title.split(' - ');
      artist = a.trim();
      title = rest.join(' - ').trim();
    }
    const t: Track = {
      id: shortid.generate(),
      trackNumber: track.track_num ?? index + 1,
      artist,
      title,
      album,
      albumArtist,
      duration: track.duration ? Math.round(track.duration) : 30, // matches discogs' 30s fallback
    };
    if (options?.cover) t.cover = options.cover;
    return t;
  });
}
