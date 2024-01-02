import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Row } from 'reactstrap';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { usernameIsValid } from 'utils/common';

import SearchForm from 'components/SearchForm';
import Avatar from 'components/Avatar';
import useLocalStorage from 'hooks/useLocalStorage';

export function ScrobbleUserSearch() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation();
  const [recentUsers] = useLocalStorage('recentUsers', []);
  const [previousFailedSearch, setFailedSearch] = useState('');
  const [usernameGood, setUsernameValidity] = useState(false); // FIXME: use better var names here...

  const searchUser = (user) => navigate(`/scrobble/user/${user}`);

  useEffect(() => {
    if (state && state.justFailedSearch) {
      setFailedSearch(state.userToSearch.toLowerCase());
    }
  }, [state]);

  const intermediateUserValidator = (str = '') => {
    setUsernameValidity(usernameIsValid(str));
    if (previousFailedSearch) {
      if (str.toLowerCase() === previousFailedSearch) {
        return false;
      } else {
        return usernameGood;
      }
    } else {
      return usernameGood;
    }
  };

  return (
    <Row className="flex-lg-grow-1 mt-3">
      <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
        <h2 className="w-100 mb-3">
          <FontAwesomeIcon icon={faUserFriends} className="me-2" />
          <Trans i18nKey="scrobbleFromOtherUser">Scrobble from other user</Trans>
        </h2>
        <Trans i18nKey="findFriendCopy">Enter a last.fm username to see their last tracks</Trans>:
        <SearchForm
          onSearch={searchUser}
          ariaLabel="Username"
          searchCopy={t('search')}
          id="userToSearch"
          maxLength={15}
          size="lg"
          value={state?.userToSearch || ''}
          // disableSearch={true}
          validator={intermediateUserValidator}
          feedbackMessageKey={usernameGood ? 'userNotFound' : 'invalidUsername'}
        />
        {recentUsers.length > 0 && (
          <>
            <h4>
              <Trans i18nKey="recentlySearchedUsers">Searched recently</Trans>
            </h4>
            <ul className="list-group mx-2 recent-users" data-cy="RecentUsers-list">
              {recentUsers.map((recentUser) => (
                <li key={recentUser} className="list-group-item sentry-mask" onClick={() => searchUser(recentUser)}>
                  <Avatar url={'' /* ToDo: restore this */} size="sm" className="me-2" />
                  {recentUser}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Row>
  );
}
