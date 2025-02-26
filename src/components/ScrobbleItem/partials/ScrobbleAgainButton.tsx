import { useState } from 'react';
import { Trans } from 'react-i18next';

import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export function ScrobbleAgainButton({ onScrobble }: { onScrobble: () => void }) {
  const [hasScrobbledAgain, setHasScrobbledAgain] = useState(false);

  const scrobbleAgain = () => {
    onScrobble();
    setHasScrobbledAgain(true);
  };

  return (
    <Button
      onClick={scrobbleAgain}
      size="sm"
      color="success"
      className="quick-scrobble-button"
      outline
      disabled={hasScrobbledAgain}
    >
      {hasScrobbledAgain ? <FontAwesomeIcon icon={faCheck} /> : <Trans i18nKey="scrobble">Scrobble</Trans>}
    </Button>
  );
}
