import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { albumSearch as LastFmSearch } from 'utils/clients/lastfm';
import { albumSearch as DiscogsSearch } from 'utils/clients/discogs';

import { Trans } from 'react-i18next';
import { Row } from 'reactstrap';

import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Spinner from 'components/Spinner';
import AlbumBreadcrumb from './partials/AlbumBreadcrumb';
import AlbumResults from './partials/AlbumResults';
import ArtistResults from './partials/ArtistResults';

import { PROVIDER_DISCOGS } from 'Constants';

export function ScrobbleAlbumResults() {
  const params = useParams();
  const { state } = useLocation();
  const [query, setQuery] = useState('');

  const dataProvider = state?.provider || PROVIDER_DISCOGS;

  // This extracts the search parameter from the URL
  useEffect(() => {
    setQuery(decodeURIComponent(params?.albumName || '').replace('PERCENT_SIGN', '%'));
  }, [params]);

  const { data, isFetching } = useQuery({
    queryKey: ['albums', query, 1], // First page only for now
    queryFn: () => {
      if (dataProvider === PROVIDER_DISCOGS) {
        return DiscogsSearch(query, !!state?.includeReleases);
      } else {
        return LastFmSearch(query);
      }
    },
    enabled: !!query,
  });

  return (
    <>
      <h2 className="m-0 d-inline">
        <FontAwesomeIcon icon={faCompactDisc} className="me-2" />
        <Trans i18nKey="scrobbleAlbum">Scrobble Album</Trans>
      </h2>
      <AlbumBreadcrumb albumQuery={query} dataProvider={dataProvider} />
      <Row className="mb-4">
        <div className="col-md-8">
          {isFetching ? <Spinner /> : <AlbumResults albums={data} query={query} useFullWidth={false} />}
        </div>
        <div className="col-md-4">
          <h3 className="mt-3 mb-0">
            <Trans i18nKey="artist" count={3}>
              Artist
            </Trans>
          </h3>
          <ArtistResults query={query} dataProvider={dataProvider} />
        </div>
      </Row>
    </>
  );
}
