import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga-neo';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import get from 'lodash/get';

import { Row, Button } from 'reactstrap';
import { Trans, useTranslation } from 'react-i18next';
import { faChevronLeft, faHistory, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SearchForm from 'components/SearchForm';
import ScrobbleList from 'components/ScrobbleList';
import Spinner from 'components/Spinner';
import { usernameIsValid } from 'utils/common';
import EmptyScrobbleListFiller from 'components/EmptyScrobbleListFiller';
import Paginator from 'components/Paginator';
import FriendScrobbles from './partials/FriendScrobbles';
import { userGetRecentTracks } from 'utils/clients/lastfm/methods/userGetRecentTracks';

import type { RootState } from 'store';

export function ScrobbleUserResults() {
  const { username: usernameFromParams } = useParams();
  const lowercaseUsername = usernameFromParams.toLowerCase();
  const localScrobbles = useSelector((state: RootState) => state.scrobbles.list);
  const [currentPage, setCurrentPage] = useState(1);
  const [isQueryEnabled, setQueryEnabled] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isLoading, isFetching, isError, error, isSuccess, isPlaceholderData } = useQuery({
    queryKey: ['profile', lowercaseUsername, 'scrobbles', currentPage],
    queryFn: () => userGetRecentTracks(lowercaseUsername, currentPage),
    staleTime: 1000 * 60 * 3, // minutes
    placeholderData: keepPreviousData,
    enabled: isQueryEnabled,
  });

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
      const errNumber = get(error, 'response.data.error');
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

  const switchUserQuery = (newUser: string) => {
    setQueryEnabled(false);
    navigate(`/scrobble/user/${newUser}`);
  };

  return (
    <div className="flex-lg-grow-1">
      {/* Heading */}
      <Row className="mb-3">
        <div className="col-md-8 d-flex align-items-center">
          <Button
            onClick={() => navigate('/scrobble/user', { state: { userToSearch: usernameFromParams } })}
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
            onSearch={switchUserQuery}
            searchCopy={t('search')}
            ariaLabel="Username"
            id="userToSearch"
            maxLength={15}
            size="sm"
            value=""
            readOnly={isLoading}
            disableSearch={isLoading}
            validator={usernameIsValid}
            feedbackMessageKey="invalidUsername"
          />
        </div>
      </Row>

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
