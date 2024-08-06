import { useDispatch, useSelector } from 'react-redux';
import { Trans } from 'react-i18next';
import ReactGA from 'react-ga-neo';

import { Button } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import type { RootState } from 'store';
import { clearListOfScrobbles } from 'store/actions/scrobbleActions';

export function ClearHistoryButton() {
  const dispatch = useDispatch();
  const isThereAnyHistory = useSelector((state: RootState) => state.scrobbles.list).length > 0;

  const clearHistory = () => {
    ReactGA.event({
      category: 'History',
      action: 'Clear',
    });
    dispatch(clearListOfScrobbles());
  };

  return (
    <Button disabled={!isThereAnyHistory} className="btn-clear" size="sm" color="secondary" onClick={clearHistory}>
      <FontAwesomeIcon icon={faTrashAlt} className="me-1" />
      <Trans i18nKey="clearHistory">Clear history</Trans>
    </Button>
  );
}
