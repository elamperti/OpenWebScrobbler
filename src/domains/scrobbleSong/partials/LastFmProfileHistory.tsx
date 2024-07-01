import { useQuery } from '@tanstack/react-query';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';
import ScrobbleList from 'components/ScrobbleList';
import { userGetRecentTracks } from 'utils/clients/lastfm/methods/userGetRecentTracks';


export function LastFmProfileHistory({ username, enabled = false }: { username: string; enabled?: boolean }) {
  const page = 1; // Only the first page is supported for now
  const { data, isFetching } = useQuery({
    queryKey: ['profile', username.toLowerCase(), 'scrobbles', page],
    queryFn: () => userGetRecentTracks(username, page),
    staleTime: 1000 * 60 * 1, // minutes
    enabled,
  });

  return (
    <ScrobbleList compact scrobbles={data?.scrobbles || []} loading={isFetching}>
      <EmptyScrobbleListFiller />
    </ScrobbleList>
  );
}
