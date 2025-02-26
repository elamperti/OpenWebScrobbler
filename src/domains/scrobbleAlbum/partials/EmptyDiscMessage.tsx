import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBolt, faCompactDisc } from '@fortawesome/free-solid-svg-icons';

export function EmptyDiscMessage() {
  const navigate = useNavigate();

  const goBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="row">
      <div className="col-12 text-center mt-4">
        <FontAwesomeIcon icon={faBolt} transform="shrink-8 up-3 right-4 rotate-30" mask={faCompactDisc} size="4x" />
        <p className="mt-2">
          <Trans i18nKey="emptyAlbum">This album appears to be empty.</Trans>
        </p>
        <a href="/scrobble/album" onClick={goBack} className="my-2">
          <FontAwesomeIcon icon={faArrowLeft} /> <Trans i18nKey="goBack">Go back</Trans>
        </a>
      </div>
    </div>
  );
}
