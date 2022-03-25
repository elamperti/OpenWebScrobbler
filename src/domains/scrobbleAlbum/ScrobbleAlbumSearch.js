import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
import ReactGA from 'react-ga';

import {
  Row,
  // FormGroup,
  // Label,
  // Input,
} from 'reactstrap';
import SearchForm from 'components/SearchForm';

import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { setDataProvider as setDataProviderAction } from 'store/actions/settingsActions';
// import { PROVIDER_DISCOGS, PROVIDER_LASTFM } from 'Constants';

import './ScrobbleAlbumSearch.scss';

export function ScrobbleAlbumSearch() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // const dataProvider = useSelector((state) => state.settings.dataProvider);
  // const dispatch = useDispatch();

  const onSearch = (query) => {
    ReactGA.event({
      category: 'Interactions',
      action: 'Search album',
    });
    const queryWithSafeFormat = encodeURIComponent(query.trim().replace(/%(?![0-9A-F])/g, 'PERCENT_SIGN'));
    navigate(`/scrobble/album/search/${queryWithSafeFormat}`);
  };

  // const setDataProvider = (e) => {
  //   const { provider } = e.currentTarget.dataset;
  //   dispatch(setDataProviderAction(provider));
  // };

  const validator = (str) => str.trim().length > 0;

  return (
    <Row className="flex-lg-grow-1 mt-3">
      <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
        <h2 className="mb-3">
          <FontAwesomeIcon icon={faCompactDisc} className="mr-2" />
          {t('scrobbleAlbum')}
        </h2>
        {t('findAlbumCopy') + ':'}
        <SearchForm
          onSearch={onSearch}
          ariaLabel="Album or artist"
          id="albumOrArtistToSearch"
          validator={validator}
          feedbackMessageKey="emptyAlbum"
        />
        {/* Hiding this to avoid confusion -- power users may switch providers from settings */}
        {/* <div className="mt-3 mt-sm-0 justify-content-center">
          <span className="mr-2">{t('dataProvider')}:</span>
          <FormGroup inline check>
            <Label check className="ows-ScrobbleAlbum-dataProvider">
              <Input
                type="radio"
                name="dataProvider"
                checked={dataProvider === PROVIDER_LASTFM}
                data-provider={PROVIDER_LASTFM}
                onClick={setDataProvider}
              />
              Last.fm
            </Label>
          </FormGroup>
          <FormGroup inline check>
            <Label check className="ows-ScrobbleAlbum-dataProvider">
              <Input
                type="radio"
                name="dataProvider"
                checked={dataProvider === PROVIDER_DISCOGS}
                data-provider={PROVIDER_DISCOGS}
                onClick={setDataProvider}
              />
              Discogs
            </Label>
          </FormGroup>
        </div> */}
      </div>
    </Row>
  );
}
