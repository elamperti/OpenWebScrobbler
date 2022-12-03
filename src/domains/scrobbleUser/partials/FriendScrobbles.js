import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, Input, FormGroup, Label } from 'reactstrap';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

import { fetchLastfmProfileInfo } from 'store/actions/userActions';
import { setSettings } from 'store/actions/settingsActions';

import UserCard from 'components/UserCard';
import ScrobbleList from 'components/ScrobbleList';

export default function FriendScrobbles({ username, page }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userProfiles = useSelector((state) => state.user.profiles);
  const keepOriginalTimestamp = useSelector((state) => state.settings.keepOriginalTimestamp);
  const friendProfile = Object.prototype.hasOwnProperty.call(userProfiles, username) ? userProfiles[username] : null;

  // ToDo: don't use a callback for this
  const checkUsernameCapitalization = (res) => {
    const correctUsername = res.value?.data?.user?.name || '';

    if (correctUsername !== username) {
      navigate(`/scrobble/user/${correctUsername}`, { replace: true });
    }
  };

  useEffect(() => {
    if (!friendProfile || !friendProfile.avatar) {
      fetchLastfmProfileInfo(dispatch)(username, checkUsernameCapitalization);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userProfiles, username]);

  const toggleOriginalTimestamp = () => {
    setSettings(dispatch)({
      keepOriginalTimestamp: !keepOriginalTimestamp,
    });
  };

  if (!friendProfile) return null;

  return (
    <React.Fragment>
      <div className="UserCard-container rect row mx-0 pb-3">
        <div className="col-sm-8 d-flex align-items-middle">
          <UserCard user={friendProfile} name={username} isHeading withLinkToProfile />
        </div>
        <div className="col-sm-4 d-flex px-3 mb-2 flex-fill justify-content-sm-end">
          <Button className="align-self-center w-100" onClick={() => navigate(0)}>
            <FontAwesomeIcon icon={faSync} /> <Trans i18nKey="refresh">Refresh</Trans>
          </Button>
        </div>
        <div className="col-12 px-3">
          <FormGroup check>
            <Label className="d-block" check>
              <Input
                type="checkbox"
                id="keepOriginalTimestamp"
                checked={keepOriginalTimestamp}
                onChange={toggleOriginalTimestamp}
              />
              <Trans i18nKey="keepOriginalTimestamp" />
            </Label>
          </FormGroup>
        </div>
      </div>
      <div className="ScrobbleList-container with-gradient">
        <ScrobbleList
          compact
          noMenu
          analyticsEventForScrobbles="Scrobble from user"
          scrobbles={friendProfile.scrobbles[page] || []}
        >
          <div className="mt-3 text-center">
            <Trans i18nKey="noSongsScrobbled">This user hasn&apos;t scrobbled anything yet!</Trans>
          </div>
        </ScrobbleList>
      </div>
    </React.Fragment>
  );
}

FriendScrobbles.propTypes = {
  username: PropTypes.string,
  page: PropTypes.number,
};
