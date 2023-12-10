import { Trans } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faUserAstronaut } from '@fortawesome/free-solid-svg-icons';

export default function EmptyScrobbleListFiller() {
  return (
    <div className="jumbotron rounded px-3 px-sm-4 py-3 py-sm-5 text-center">
      <div className="d-flex align-items-start justify-content-center mb-2">
        <FontAwesomeIcon icon={faUserAstronaut} color="var(--bs-gray-dark)" size="6x" />
        <FontAwesomeIcon icon={faQuestion} color="var(--bs-gray-dark)" size="2x" transform="shrink-4" />
      </div>
      <strong>
        <Trans i18nKey="noSongsScrobbled">No songs scrobbled yet!</Trans>
      </strong>
      <br />
      <Trans i18nKey="songsWillAppearHere">Tracks will appear here once you scrobble them.</Trans>
    </div>
  );
}
