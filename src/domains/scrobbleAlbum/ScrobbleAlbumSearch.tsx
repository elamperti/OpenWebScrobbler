import { useEffect, useState } from 'react';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import ReactGA from 'react-ga-neo';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { DropdownItem, FormGroup, Input, Label, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';

import SearchForm from 'components/SearchForm';
import useLocalStorage from 'hooks/useLocalStorage';

import { albumViewPath } from './albumViewPath';
import AlbumList from './partials/AlbumList';

import { PROVIDER_BANDCAMP, PROVIDER_DISCOGS, PROVIDER_LASTFM, PROVIDER_NAME } from 'Constants';

import type { Provider } from 'Constants';
import type { Album } from 'utils/types/album';

import './ScrobbleAlbumSearch.scss';

export function ScrobbleAlbumSearch() {
  const [includeReleases, setIncludeReleases] = useState(false);
  const [includeTracks, setIncludeTracks] = useState(false);
  const [lastUsedProvider, setLastUsedProvider] = useLocalStorage<Provider>('lastUsedProvider', PROVIDER_DISCOGS);
  const [dataProvider, setProvider] = useState<Provider>(lastUsedProvider);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const spotifyFF = useFeatureIsOn('spotify');
  const [recentAlbums] = useLocalStorage<Album[]>('recentAlbums', []);

  const toggleReleaseSwitch = () => setIncludeReleases(!includeReleases);

  useEffect(() => {
    setLastUsedProvider(dataProvider);
  }, [dataProvider, setLastUsedProvider]);

  const onSearch = (query) => {
    ReactGA.event({
      category: 'Interactions',
      action: 'Search album',
    });
    const queryWithSafeFormat = encodeURIComponent(query.trim().replace(/%(?![0-9A-F])/g, 'PERCENT_SIGN'));
    navigate(`/scrobble/album/search/${queryWithSafeFormat}`, {
      state: {
        provider: dataProvider,
        includeReleases,
        includeTracks,
        query,
      },
    });
  };

  const navigateToAlbum = (e) => {
    e.preventDefault();
    const { albumIndex } = e.currentTarget.dataset;
    const targetAlbum = recentAlbums[albumIndex];

    ReactGA.event({
      category: 'Interactions',
      action: 'Click album',
      label: albumIndex,
    });

    navigate(albumViewPath(targetAlbum));
  };

  const validator = (str) => str.trim().length > 0;

  const searchOptions = (
    <>
      <DropdownItem onClick={() => setProvider(PROVIDER_DISCOGS)}>Discogs</DropdownItem>
      <DropdownItem onClick={() => setProvider(PROVIDER_LASTFM)}>Last.fm</DropdownItem>
      <DropdownItem onClick={() => setProvider(PROVIDER_BANDCAMP)}>Bandcamp</DropdownItem>
      {spotifyFF && (
        <DropdownItem disabled>
          Spotify (<Trans i18nKey="comingSoon">coming soon!</Trans>)
        </DropdownItem>
      )}
    </>
  );

  return (
    <div className="ows-ScrobbleAlbumSearch">
      <Row className="flex-lg-grow-1 mt-3">
        <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
          <h2 className="mb-3">
            <FontAwesomeIcon icon={faCompactDisc} className="me-2" />
            <Trans i18nKey="scrobbleAlbum" />
          </h2>
          <Trans i18nKey="findAlbumCopy" />:
          <SearchForm
            searchOptions={searchOptions}
            searchCopy={t('searchOnProvider', { dataProvider: PROVIDER_NAME[dataProvider] })}
            onSearch={onSearch}
            ariaLabel="Album or artist"
            id="albumOrArtistToSearch"
            validator={validator}
            feedbackMessageKey="emptyAlbum"
          />
          {dataProvider === PROVIDER_DISCOGS && (
            <FormGroup inline switch>
              <Input
                className="mt-1"
                type="switch"
                name="includeReleases"
                id="includeReleases"
                checked={includeReleases}
                onChange={toggleReleaseSwitch}
                data-cy="ScrobbleAlbumSearch-include-releases"
              />
              <Label for="includeReleases" check>
                <Trans i18nKey="includeReleases" />
              </Label>
            </FormGroup>
          )}
          {dataProvider === PROVIDER_BANDCAMP && (
            <FormGroup inline switch>
              <Input
                className="mt-1"
                type="switch"
                name="includeTracks"
                id="includeTracks"
                checked={includeTracks}
                onChange={() => setIncludeTracks(!includeTracks)}
                data-cy="ScrobbleAlbumSearch-include-tracks"
              />
              <Label for="includeTracks" check>
                <Trans i18nKey="includeTracks" />
              </Label>
            </FormGroup>
          )}
        </div>
      </Row>
      {recentAlbums.length > 0 && (
        <>
          <hr />
          <AlbumList albums={recentAlbums} className="col-6 col-sm-4 col-md-3 col-xl-2" onClick={navigateToAlbum} />
        </>
      )}
    </div>
  );
}
