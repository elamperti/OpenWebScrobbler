import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactGA from 'react-ga-neo';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';

import { ClearHistoryButton } from 'components/ClearHistoryButton';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';
import Paginator from 'components/Paginator';
import ScrobbleList from 'components/ScrobbleList';
import Spinner from 'components/Spinner';
import useLocalStorage from 'hooks/useLocalStorage';
import { userGetRecentTracks } from 'utils/clients/lastfm/methods/userGetRecentTracks';

import FriendScrobbles from './partials/FriendScrobbles';
import { UserResultsHeading } from './partials/UserResultsHeading';

import { MAX_RECENT_USERS } from 'Constants';

import type { RootState } from 'store';

export function ScrobbleUserResults() {
  const { username: usernameFromParams } = useParams();
  const lowercaseUsername = usernameFromParams.toLowerCase();
  const localScrobbles = useSelector((state: RootState) => state.scrobbles.list);
  const [currentPage, setCurrentPage] = useState(1);
  const [isQueryEnabled, setQueryEnabled] = useState(true);
  const [recentUsers, setRecentUsers] = useLocalStorage('recentUsers', []);
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError, error, isSuccess, isPlaceholderData } = useQuery({
    queryKey: ['profile', lowercaseUsername, 'scrobbles', currentPage],
    queryFn: () => userGetRecentTracks(lowercaseUsername, currentPage),
    staleTime: 1000 * 60 * 3, // minutes
    placeholderData: keepPreviousData,
    enabled: isQueryEnabled,
  });

  useEffect(() => {
    if (isSuccess) {
      const username = data?.username || '';
      const currentIndex = recentUsers.indexOf(username);
      if (currentIndex > -1) {
        recentUsers.splice(currentIndex, 1);
      }
      recentUsers.unshift(username);
      setRecentUsers(recentUsers.slice(0, MAX_RECENT_USERS));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const totalPages = data?.totalPages || 1;

  // ToDo: Test this fires once per user change
  useEffect(() => {
    if (currentPage === 1 && lowercaseUsername && isSuccess) {
      ReactGA.event({
        category: 'Search',
        action: 'User',
      });
    }
  }, [currentPage, lowercaseUsername, isSuccess]);

  // Go back to the first page when the username changes
  // ToDo: add test for this
  useEffect(() => {
    setCurrentPage(1);
    setQueryEnabled(true);
  }, [usernameFromParams]);

  // Keep URL capitalization consistent with Last.fm username
  useEffect(() => {
    if (isSuccess && !isPlaceholderData && usernameFromParams !== data.username) {
      navigate(`/scrobble/user/${data.username}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, lowercaseUsername, isSuccess, isPlaceholderData]);

  useEffect(() => {
    if (isError) {
      const errNumber = error?.response?.data?.error;
      // 6: User not found - 17: User has a private profile
      if (errNumber === 6 || errNumber === 17) {
        // ToDo: handle private profile case
        navigate('/scrobble/user', {
          state: {
            userToSearch: usernameFromParams,
            justFailedSearch: true,
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  return (
    <div className="flex-lg-grow-1">
      {/* Heading */}
      <UserResultsHeading isLoading={isLoading} userToSearch={usernameFromParams} />

      {/* Main blocks */}
      <Row>
        {/* Friend user data and scrobbles */}
        <div className="col-md-7 mb-4">
          {isLoading && <Spinner />}
          {data && (
            <>
              <FriendScrobbles loading={isFetching} username={data.username} scrobbles={data.scrobbles} />
              {!isLoading && totalPages > 1 && (
                <Paginator pageCount={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
              )}
            </>
          )}
        </div>

        {/* Own profile history (sidebar) */}
        <div className="col-md-5">
          <div className="d-flex flex-row justify-content-between">
            <h4>
              <FontAwesomeIcon icon={faHistory} /> <Trans i18nKey="yourHistory">Your history</Trans>
            </h4>
            <ClearHistoryButton />
          </div>
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
