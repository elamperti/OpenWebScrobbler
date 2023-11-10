import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ReactGA from 'react-ga';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

import { Row, FormGroup, Input, Label, DropdownItem } from 'reactstrap';
import SearchForm from 'components/SearchForm';

import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PROVIDER_NAME, PROVIDER_LASTFM, PROVIDER_DISCOGS } from 'Constants';
import AlbumList from './partials/AlbumList';

import './ScrobbleAlbumSearch.scss';
import { setDataProvider } from 'store/actions/settingsActions';
import { setAlbumQuery } from 'store/actions/albumActions';

import type { RootState } from 'store';

export function ScrobbleAlbumSearch() {
  const [includeReleases, setIncludeReleases] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const spotifyFF = useFeatureIsOn('spotify');
  const dataProvider = useSelector((state: RootState) => state.settings.dataProvider);
  const recentAlbums = useSelector((state: RootState) => state.user.recentAlbums || []);

  const toggleReleaseSwitch = () => setIncludeReleases(!includeReleases);

  const onSearch = (query) => {
    ReactGA.event({
      category: 'Interactions',
      action: 'Search album',
    });
    const queryWithSafeFormat = encodeURIComponent(query.trim().replace(/%(?![0-9A-F])/g, 'PERCENT_SIGN'));
    navigate(`/scrobble/album/search/${queryWithSafeFormat}`, {
      state: {
        includeReleases,
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

    // Clears previous queries
    dispatch(setAlbumQuery(''));

    if (targetAlbum.mbid) {
      navigate(`/scrobble/album/view/mbid/${targetAlbum.mbid}`);
    } else if (targetAlbum.discogsId) {
      navigate(`/scrobble/album/view/dsid/${targetAlbum.discogsId}`);
    } else {
      const sanitizedArtistName = targetAlbum.artist ? encodeURIComponent(targetAlbum.artist.replace('%', '')) : '_';
      navigate(`/scrobble/album/view/${sanitizedArtistName}/${encodeURIComponent(targetAlbum.name.replace('%', ''))}`);
    }
  };

  const validator = (str) => str.trim().length > 0;

  const setProvider = (newDataProvider) => dispatch(setDataProvider(newDataProvider));

  const searchOptions = (
    <>
      <DropdownItem onClick={() => setProvider(PROVIDER_DISCOGS)}>Discogs</DropdownItem>
      <DropdownItem onClick={() => setProvider(PROVIDER_LASTFM)}>Last.fm</DropdownItem>
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
              />
              <Label for="includeReleases" check>
                <Trans i18nKey="includeReleases" />
              </Label>
            </FormGroup>
          )}
        </div>
      </Row>
      {recentAlbums.length > 0 && (
        <React.Fragment>
          <hr />
          <AlbumList albums={recentAlbums} className="col-6 col-sm-4 col-md-3 col-xl-2" onClick={navigateToAlbum} />
        </React.Fragment>
      )}
    </div>
  );
}
