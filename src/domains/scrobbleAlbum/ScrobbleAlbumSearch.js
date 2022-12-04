import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactGA from 'react-ga';

import { Row, FormGroup, Input, Label } from 'reactstrap';
import SearchForm from 'components/SearchForm';

import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PROVIDER_DISCOGS } from 'Constants';
import AlbumList from './partials/AlbumList';

import './ScrobbleAlbumSearch.scss';

export function ScrobbleAlbumSearch() {
  const [includeReleases, setIncludeReleases] = useState(false);
  const navigate = useNavigate();
  const dataProvider = useSelector((state) => state.settings.dataProvider);
  const recentAlbums = useSelector((state) => state.user.recentAlbums || []);

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

    if (targetAlbum.mbid) {
      navigate(`/scrobble/album/view/mbid/${targetAlbum.mbid}`);
    } else if (targetAlbum.discogsId) {
      navigate(`/scrobble/album/view/dsid/${targetAlbum.discogsId}`);
    } else {
      navigate(
        `/scrobble/album/view/${encodeURIComponent(targetAlbum.artist.replace('%', ''))}` +
          `/${encodeURIComponent(targetAlbum.name.replace('%', ''))}`
      );
    }
  };

  const validator = (str) => str.trim().length > 0;

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
