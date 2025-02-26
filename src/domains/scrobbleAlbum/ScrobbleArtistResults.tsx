import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';

import Spinner from 'components/Spinner';
import { searchTopAlbums as DiscogsSearch } from 'utils/clients/discogs';
import { searchTopAlbums as LastFmSearch } from 'utils/clients/lastfm';
import { sanitizeProvider } from 'utils/common';

import AlbumBreadcrumb from './partials/AlbumBreadcrumb';
import AlbumResults from './partials/AlbumResults';

import { PROVIDER_DISCOGS, PROVIDER_LASTFM } from 'Constants';

export function ScrobbleArtistResults() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const { state } = useLocation();
  const [artistName, setArtistName] = useState('');

  const dataProvider =
    state?.provider ||
    (params.discogsId ? PROVIDER_DISCOGS : sanitizeProvider(searchParams.get('source'), PROVIDER_LASTFM));

  useEffect(() => {
    setArtistName(decodeURIComponent(params.artistName || ''));
  }, [params]);

  const artistKey = params.mbid || params.discogsId || artistName;
  const { data, isFetching } = useQuery({
    queryKey: ['topAlbums', dataProvider, artistKey, 1], // First page only for now
    queryFn: () => {
      if (dataProvider === PROVIDER_DISCOGS) {
        return DiscogsSearch(params.discogsId);
      } else {
        return LastFmSearch({
          name: artistName,
          mbid: params.mbid,
        });
      }
    },
    enabled: dataProvider === PROVIDER_DISCOGS ? !!params.discogsId : !!(artistName || params.mbid),
  });

  return (
    <>
      <h2 className="m-0 d-inline">
        <FontAwesomeIcon icon={faCompactDisc} className="me-2" />
        {t('scrobbleAlbum')}
      </h2>
      <AlbumBreadcrumb
        artistQuery={state?.artist || artistName}
        artistDiscogsId={params?.discogsId}
        albumQuery={state?.query}
        dataProvider={dataProvider}
      />
      <h3 className="mt-3 mb-0">
        {state?.artist && <Trans i18nKey="topAlbumsBy" t={t} values={{ nameOfArtist: state.artist }} />}
      </h3>
      {isFetching ? <Spinner /> : <AlbumResults albums={data} query={artistName} useFullWidth={true} />}
    </>
  );
}
