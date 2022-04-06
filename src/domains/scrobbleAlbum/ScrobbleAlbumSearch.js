import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactGA from 'react-ga';

import { Row, FormGroup, CustomInput } from 'reactstrap';
import SearchForm from 'components/SearchForm';

import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PROVIDER_DISCOGS } from 'Constants';

import './ScrobbleAlbumSearch.scss';

export function ScrobbleAlbumSearch() {
  const [includeReleases, setIncludeReleases] = useState(false);
  const navigate = useNavigate();
  const dataProvider = useSelector((state) => state.settings.dataProvider);

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

  const validator = (str) => str.trim().length > 0;

  return (
    <Row className="flex-lg-grow-1 mt-3">
      <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
        <h2 className="mb-3">
          <FontAwesomeIcon icon={faCompactDisc} className="mr-2" />
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
          <FormGroup inline check>
            <CustomInput
              type="switch"
              label="Include releases in search results"
              name="includeReleases"
              id="includeReleases"
              checked={includeReleases}
              onChange={toggleReleaseSwitch}
            />
          </FormGroup>
        )}
      </div>
    </Row>
  );
}
