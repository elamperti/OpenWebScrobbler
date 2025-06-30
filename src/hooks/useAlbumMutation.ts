import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deepMerge } from 'utils/objects';

import type { QueryKey } from '@tanstack/react-query';
import type { AlbumWithTracks } from 'utils/types/album';
import type { DeepPartial } from 'utils/types/cursed';

/**
 * Merges a partial album object on top of an album object (changing track artists if needed).
 */
export function __updateAlbumWithTracks(oldData: AlbumWithTracks, updatedAlbum: AlbumWithTracks): AlbumWithTracks {
  if ('artist' in updatedAlbum.info) {
    const oldArtist = oldData.info.artist || '';
    updatedAlbum.tracks = oldData.tracks.map((track) => {
      return {
        ...track,
        artist: track.artist === oldArtist ? updatedAlbum.info.artist : track.artist,
      };
    });
  }
  return deepMerge(oldData, updatedAlbum);
}

/**
 * Provides a custom mutation function to update album data without hitting the backend
 */
export function useAlbumMutation(queryKey: QueryKey) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation<AlbumWithTracks, Error, DeepPartial<AlbumWithTracks>, AlbumWithTracks>({
    networkMode: 'always', // You don't need a network if you are not hitting the backend 👉🏼😉
    mutationFn: async (newAlbumData) => newAlbumData as AlbumWithTracks, // But this is actually a partial ¯\_(ツ)_/¯
    onSuccess: (updatedAlbum: AlbumWithTracks) => {
      queryClient.setQueryData<AlbumWithTracks>(queryKey, (oldData) => __updateAlbumWithTracks(oldData, updatedAlbum));
    },
  });

  return mutate;
}
