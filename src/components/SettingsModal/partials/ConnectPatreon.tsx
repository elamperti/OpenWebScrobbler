import { Button } from 'reactstrap';
import { Trans } from 'react-i18next';
import ReactGA from 'react-ga-neo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { useSettings } from 'hooks/useSettings';

import { PATREON_AUTH_URL } from 'Constants';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPatreon } from '@fortawesome/free-brands-svg-icons';

const ConnectPatreon = () => {
  const { settings } = useSettings();
  const handleConnectPatreon = () => {
    ReactGA.event({
      category: 'Patreon',
      action: 'Link account intent (settings)',
    });
    // eslint-disable-next-line react-compiler/react-compiler
    window.location.href = PATREON_AUTH_URL;
  };

  return (
    <div className="d-flex justify-content-between px-4">
      <span className="align-content-center">
        {/* <FontAwesomeIcon icon={faPatreon} className="me-2" /> */}
        Patreon
      </span>
      {settings.patreonId && (
        <div className="btn btn-sm btn-outline border border-dark disabled">
          <FontAwesomeIcon icon={faCheck} className="me-2 text-success" />
          <Trans i18nKey="connected">Connected</Trans>
        </div>
      )}
      {!settings.patreonId && (
        <Button className="ms-2" size="sm" outline color="success" onClick={handleConnectPatreon}>
          <Trans i18nKey="connect">Connect</Trans>
        </Button>
      )}
    </div>
  );
};

export default ConnectPatreon;
