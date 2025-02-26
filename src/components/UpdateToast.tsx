import ReactGA from 'react-ga-neo';
import { Trans } from 'react-i18next';

import { Alert, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faExclamation } from '@fortawesome/free-solid-svg-icons';

import './UpdateToast.css';

export default function UpdateToast({ onUpdate }: { onUpdate: () => void }) {
  const reloadPage = () => {
    ReactGA.event({
      category: 'Interactions',
      action: 'SW Manual Update',
    });
    onUpdate();
  };

  return (
    <Alert color="primary" className="UpdateToast mx-4 py-1">
      <FontAwesomeIcon icon={faExclamation} transform="shrink-8" mask={faComment} className="me-2" />
      <Trans i18nKey="updates.newVersionAvailable">
        {"There's a new version available! Please "}
        <Button size="sm" color="info" onClick={reloadPage}>
          reload the page
        </Button>
      </Trans>
    </Alert>
  );
}
