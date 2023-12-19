import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { searchTopAlbums as LastFmSearch } from 'utils/clients/lastfm';
import { searchTopAlbums as DiscogsSearch } from 'utils/clients/discogs';

import { PROVIDER_DISCOGS, PROVIDER_LASTFM } from 'Constants';

import AlbumBreadcrumb from './partials/AlbumBreadcrumb';
import AlbumResults from './partials/AlbumResults';

import Spinner from 'components/Spinner';

export function ScrobbleArtistResults() {
  const { t } = useTranslation();
  const params = useParams();
  const { state } = useLocation();
  const [artistName, setArtistName] = useState('');

  const dataProvider = state?.provider || (params.discogsId ? PROVIDER_DISCOGS : PROVIDER_LASTFM);

  useEffect(() => {
    setArtistName(decodeURIComponent(params.artistName || ''));
  }, [params]);

  const artistKey = params.mbid || params.discogsId || artistName;
  const { data, isFetching } = useQuery({
    queryKey: ['topAlbums', artistKey, 1], // First page only for now
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
    enabled: dataProvider === PROVIDER_DISCOGS ? !!params.discogsId : !!artistName,
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
