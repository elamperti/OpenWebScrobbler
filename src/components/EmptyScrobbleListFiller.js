import React from 'react';
import { translate, Trans } from 'react-i18next';

import {
  Jumbotron,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestion,
  faUserAstronaut,
} from '@fortawesome/free-solid-svg-icons';

const EmptyScrobbleListFiller = () => {
  return (
    <Jumbotron className="text-center">
      <div className="d-flex align-items-start justify-content-center mb-2">
        <FontAwesomeIcon icon={faUserAstronaut} color="var(--gray-dark)" size="6x" />
        <FontAwesomeIcon icon={faQuestion} color="var(--gray-dark)" size="2x" transform="shrink-4" />
      </div>
      <strong><Trans i18nKey="noSongsScrobbled">No songs scrobbled yet!</Trans></strong><br />
      <Trans i18nKey="songsWillAppearHere">Tracks will appear here once you scrobble them.</Trans>
    </Jumbotron>
  );
};

export default translate(['common'])(EmptyScrobbleListFiller);
