import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from 'store';
import { useQuery } from '@tanstack/react-query';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faList } from '@fortawesome/free-solid-svg-icons';

import { getSetlistById } from 'utils/clients/setlistfm';

import { ClearHistoryButton } from 'components/ClearHistoryButton';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';
import ScrobbleList from 'components/ScrobbleList';
import Spinner from 'components/Spinner';
import SetlistViewer from './partials/SetlistViewer';

export function ScrobbleSetlistView() {
  const params = useParams();
  const [setlistId, setSetlistId] = useState('');
  const scrobbles = useSelector((state: RootState) => state.scrobbles.list);

  // This extracts the search parameter from the URL
  useEffect(() => {
    setSetlistId(decodeURIComponent(params?.setlistId || '').toLowerCase());
  }, [params]);

  const { data, isLoading } = useQuery({
    queryKey: ['setlist', 'view', setlistId],
    queryFn: () => {
      return getSetlistById(setlistId);
    },
    enabled: !!setlistId,
  });

  return (
    <>
      <h2>
        <FontAwesomeIcon icon={faList} className="me-2" />
        <Trans i18nKey="scrobbleSetlist">Scrobble Setlist</Trans>
      </h2>
      <div className="row mb-5">
        <div className="col-md-7 mb-4">{isLoading || !data ? <Spinner /> : <SetlistViewer setlist={data} />}</div>
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
    </>
  );
}
