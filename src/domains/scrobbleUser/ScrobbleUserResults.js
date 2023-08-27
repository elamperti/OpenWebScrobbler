import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga';
import get from 'lodash/get';

import { Row, Button } from 'reactstrap';
import { Trans, useTranslation } from 'react-i18next';
import { faChevronLeft, faHistory, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { fetchLastfmProfileHistory } from 'store/actions/userActions';

import SearchForm from 'components/SearchForm';
import ScrobbleList from 'components/ScrobbleList';
import Spinner from 'components/Spinner';
import { usernameIsValid } from 'utils/common';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';
import Paginator from 'components/Paginator';
import FriendScrobbles from './partials/FriendScrobbles';

export function ScrobbleUserResults() {
  const [isLoading, setLoadingState] = useState(true);
  const params = useParams();
  const { username } = params;
  const localScrobbles = useSelector((state) => state.scrobbles.list);
  const totalPages = useSelector((state) => parseInt(state.user.profiles[username]?.totalPages) || 1);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (username) {
      ReactGA.event({
        category: 'Search',
        action: 'User',
      });
      setLoadingState(true);

      fetchLastfmProfileHistory(dispatch)(username, { page: currentPage }, (res, err) => {
        const errNumber = get(err, 'data.error');
        // 6: User not found - 17: User has a private profile
        if (errNumber === 6 || errNumber === 17) {
          // ToDo: handle private profile case
          navigate('/scrobble/user', {
            state: {
              userToSearch: username,
              justFailedSearch: true,
            },
          });
        } else {
          setLoadingState(false);
        }
      });
    }
  }, [currentPage, username, navigate, dispatch]);

  return (
    <div className="flex-lg-grow-1">
      <Row className="mb-3">
        <div className="col-md-8 d-flex align-items-center">
          <Button
            onClick={() => navigate('/scrobble/user', { state: { userToSearch: username } })}
            size="sm"
            className="me-3"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <h2 className="w-100 m-0 d-inline">
            <FontAwesomeIcon icon={faUserFriends} className="me-2" />
            <Trans i18nKey="scrobbleFromOtherUser">Scrobble from another user</Trans>
          </h2>
        </div>
        <div className="col-md-4 d-flex align-items-center justify-content-end">
          <SearchForm
            onSearch={(newUser) => navigate(`/scrobble/user/${newUser}`)}
            searchCopy={t('search')}
            ariaLabel="Username"
            id="userToSearch"
            maxLength={15}
            size="sm"
            value={params.username}
            readOnly={isLoading}
            disableSearch={isLoading}
            validator={usernameIsValid}
            feedbackMessageKey="invalidUsername"
          />
        </div>
      </Row>
      <Row>
        <div className="col-md-7 mb-4">
          {isLoading ? (
            <Spinner />
          ) : (
            <React.Fragment>
              <FriendScrobbles username={params.username} page={currentPage} />
              {totalPages > 1 && (
                <Paginator pageCount={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
              )}
            </React.Fragment>
          )}
        </div>
        <div className="col-md-5">
          <h4>
            <FontAwesomeIcon icon={faHistory} /> <Trans i18nKey="yourHistory">Your history</Trans>
          </h4>
          <div className="ScrobbleList-container">
            <ScrobbleList scrobbles={localScrobbles}>
              <EmptyScrobbleListFiller />
            </ScrobbleList>
          </div>
        </div>
      </Row>
    </div>
  );
}
