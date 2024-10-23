import { faHistory, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClearHistoryButton } from 'components/ClearHistoryButton';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';
import ScrobbleList from 'components/ScrobbleList';
import SetlistViewer from 'domains/scrobbleSetlist/Setlist';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from 'store';
import { setlistTransformer } from 'utils/clients/setlistfm/transformers.ts/setlist.transformer';

export function ScrobbleSetlistView() {
  const { state } = useLocation();
  const scrobbles = useSelector((state: RootState) => state.scrobbles.list);
  const setlist = setlistTransformer(state);
  return (
    <>
      <h2>
        <FontAwesomeIcon icon={faList} className="me-2" />
        Scrobble Setlist View
      </h2>
      <div className="row mb-5">
        <div className="col-md-7 mb-4">
          <SetlistViewer setlist={setlist} />
        </div>
        <div className="col-md-5">
          <div className="d-flex flex-row justify-content-between">
            <h4>
              <FontAwesomeIcon icon={faHistory} /> <Trans i18nKey="yourHistory" />
            </h4>
            <ClearHistoryButton />
          </div>
          <div className="ScrobbleList-container">
            <ScrobbleList scrobbles={scrobbles}>
              <EmptyScrobbleListFiller />
            </ScrobbleList>
          </div>
        </div>
      </div>
      {/* <Button>`Date: ${data.setlist.eventDate}`</Button> */}
    </>
  );
}
