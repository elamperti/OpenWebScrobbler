import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trans } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';

import Paginator from 'components/Paginator';
import Spinner from 'components/Spinner';
import { searchSetlist } from 'utils/clients/api/methods/setlistSearchByArtist';

import { SetlistList } from './partials/SetlistList';

export function ScrobbleSetlistResult() {
  const params = useParams();
  const [artistName, setArtistName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // This extracts the search parameter from the URL
  useEffect(() => {
    setArtistName(decodeURIComponent(params?.query || '').toLowerCase());
  }, [params]);

  const { data, isLoading } = useQuery({
    queryKey: ['setlist', 'search', 'artist', artistName, currentPage],
    queryFn: () => {
      return searchSetlist(artistName, currentPage);
    },
    enabled: !!artistName,
  });

  return (
    <>
      <h2>
        <FontAwesomeIcon icon={faList} className="me-2" />
        <Trans i18nKey="scrobbleSetlist">Scrobble Setlist</Trans>
      </h2>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {data?.results && <SetlistList setlists={data.results} query={artistName} />}
          {data?.totalPages > 1 && (
            <Paginator pageCount={data.totalPages} currentPage={data.page} onPageChange={setCurrentPage} />
          )}
        </>
      )}
    </>
  );
}
