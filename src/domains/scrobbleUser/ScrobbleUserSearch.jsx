import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { Row } from 'reactstrap';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { usernameIsValid } from 'utils/common';

import SearchForm from 'components/SearchForm';
import Avatar from 'components/Avatar';

export function ScrobbleUserSearch() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation();
  const recentUsers = useSelector((state) => state.user.recentProfiles);
  const userProfiles = useSelector((state) => state.user.profiles);
  const [previousFailedSearch, setFailedSearch] = useState('');
  const [usernameGood, setUsernameValidity] = useState(false); // FIXME: use better var names here...

  const recentUsersList = [];
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

  // ToDo: just iterate over recentUsers inside the <ul> below
  if (recentUsers.length > 0) {
    for (const recentUser of recentUsers) {
      const profileImg = Object.prototype.hasOwnProperty.call(userProfiles, recentUser)
        ? userProfiles[recentUser].avatar?.md
        : null;

      // ToDo: use <a> so users can copy a permalink to a recent search
      recentUsersList.push(
        <li key={recentUser} className="list-group-item" onClick={() => searchUser(recentUser)}>
          <Avatar url={profileImg} size="sm" className="me-2" />
          {recentUser}
        </li>
      );
    }
  }

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
        {recentUsersList.length > 0 && (
          <>
            <h4>
              <Trans i18nKey="recentlySearchedUsers">Searched recently</Trans>
            </h4>
            <ul className="list-group mx-2 recent-users">{recentUsersList}</ul>
          </>
        )}
      </div>
    </Row>
  );
}
