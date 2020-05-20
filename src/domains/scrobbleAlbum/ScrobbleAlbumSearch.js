import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ReactGA from 'react-ga';

import { Row } from 'reactstrap';
import SearchForm from 'components/SearchForm';

import { faCompactDisc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './ScrobbleAlbumSearch.scss';

export function ScrobbleAlbumSearch() {
  const history = useHistory();
  const { t } = useTranslation();

  const onSearch = (query) => {
    ReactGA.event({
      category: 'Interactions',
      action: 'Search album',
    });

    history.push(`/scrobble/album/search/${encodeURIComponent(query.trim())}`);
  };

  const validator = (str) => str.trim().length > 0;

  return (
    <Row className="flex-lg-grow-1 mt-3">
      <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
        <h2 className="mb-3">
          <FontAwesomeIcon icon={faCompactDisc} className="mr-2" />{t('scrobbleAlbum')}
        </h2>
        {t('findAlbumCopy') + ':'}
        <SearchForm
          onSearch={onSearch}
          ariaLabel="Album or artist"
          id="albumOrArtistToSearch"
          validator={validator}
          feedbackMessageKey="emptyAlbum"
        />
        {/* <Row className="mt-3 mt-sm-0">
          <Col xs="6" sm="4">
            <FormGroup check>
              <Label check className="ows-ScrobbleAlbum-typeOfSearch">
                <Input type="radio" name="typeOfSearch" />
                <Trans i18nKey="album">Album</Trans>
              </Label>
            </FormGroup>
          </Col>
          <Col xs="6" sm="4">
            <FormGroup check>
              <Label check className="ows-ScrobbleAlbum-typeOfSearch">
                <Input type="radio" name="typeOfSearch" />
                <Trans i18nKey="artist">Artist</Trans>
              </Label>
            </FormGroup>
          </Col>
        </Row> */}
      </div>
    </Row>
  );
}
