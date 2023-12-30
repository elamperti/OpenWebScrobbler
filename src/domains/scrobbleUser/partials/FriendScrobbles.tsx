import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import { Input, FormGroup, Label } from 'reactstrap';
import { Trans } from 'react-i18next';

import UserCard from 'components/UserCard';
import ScrobbleList from 'components/ScrobbleList';
import { userGetProfile } from 'utils/clients/lastfm/methods/userGetProfile';
import { useSettings } from 'hooks/useSettings';

import type { Scrobble } from 'utils/types/scrobble';
import { addRecentUser, saveUserInfo } from 'store/actions/userActions';
import RefreshProfile from './RefreshProfile';

export default function FriendScrobbles({
  username,
  scrobbles,
  loading = false,
}: {
  username: string;
  scrobbles: Scrobble[];
  loading: boolean;
}) {
  const dispatch = useDispatch();
  const { settings, updateSettings } = useSettings();
  const lowercaseUsername = username.toLowerCase();

  // ToDo: move this query to UserCard
  const friendProfileQuery = useQuery({
    queryKey: ['profile', lowercaseUsername, 'info'],
    queryFn: () => userGetProfile(lowercaseUsername),
  });

  useEffect(() => {
    const username = friendProfileQuery.data?.name;
    if (friendProfileQuery.isSuccess && username) {
      dispatch(addRecentUser(username));
      dispatch(saveUserInfo(friendProfileQuery.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendProfileQuery.isSuccess]);

  const toggleOriginalTimestamp = () => {
    updateSettings({
      keepOriginalTimestamp: !settings?.keepOriginalTimestamp,
    });
  };

  if (friendProfileQuery.isLoading) return null;

  const showPagination = !friendProfileQuery.isFetching && scrobbles && scrobbles.length > 0;

  return (
    <>
      <div className="UserCard-container rect row mx-0 pb-3">
        <div className="col-sm-8 d-flex align-items-middle">
          {!friendProfileQuery.isLoading && (
            <UserCard user={friendProfileQuery.data} name={username} isHeading withLinkToProfile />
          )}
        </div>
        <div className="col-sm-4 d-flex px-3 mb-2 flex-fill justify-content-sm-end">
          <RefreshProfile username={lowercaseUsername} />
        </div>
        {showPagination && (
          <div className="col-12 px-3">
            <FormGroup check>
              <Label className="d-block" check>
                <Input
                  type="checkbox"
                  id="keepOriginalTimestamp"
                  checked={settings?.keepOriginalTimestamp}
                  onChange={toggleOriginalTimestamp}
                />
                <Trans i18nKey="keepOriginalTimestamp" />
              </Label>
            </FormGroup>
          </div>
        )}
      </div>
      <div className={`ScrobbleList-container with-gradient${loading ? ' opacity-50' : ''}`}>
        <ScrobbleList compact noMenu analyticsEventForScrobbles="Scrobble from user" scrobbles={scrobbles}>
          <div className="mt-3 text-center">
            <Trans i18nKey="noSongsScrobbled">This user hasn&apos;t scrobbled anything yet!</Trans>
          </div>
        </ScrobbleList>
      </div>
    </>
  );
}
