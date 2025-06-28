import { useQuery } from '@tanstack/react-query';
import { Trans } from 'react-i18next';

import { FormGroup, Input, Label } from 'reactstrap';

import ScrobbleList from 'components/ScrobbleList';
import UserCard from 'components/UserCard';
import { useSettings } from 'hooks/useSettings';
import { userGetProfile } from 'utils/clients/lastfm/methods/userGetProfile';

import RefreshProfile from './RefreshProfile';

import type { Scrobble } from 'utils/types/scrobble';

export default function FriendScrobbles({
  username,
  scrobbles,
  loading = false,
}: {
  username: string;
  scrobbles: Scrobble[];
  loading: boolean;
}) {
  const { settings, updateSettings } = useSettings();
  const lowercaseUsername = username.toLowerCase();

  // ToDo: move this query to UserCard
  const friendProfileQuery = useQuery({
    queryKey: ['profile', lowercaseUsername, 'info'],
    queryFn: () => userGetProfile(lowercaseUsername),
  });

  const toggleOriginalTimestamp = () => {
    updateSettings({
      keepOriginalTimestamp: !settings?.keepOriginalTimestamp,
    });
  };

  if (friendProfileQuery.isLoading) return null;

  const dataIsReady = !friendProfileQuery.isFetching && scrobbles && scrobbles.length > 0;

  return (
    <>
      <div className="UserCard-container rect row mx-0 pb-3">
        <div className="col-sm-8 d-flex align-items-middle">
          {friendProfileQuery.isSuccess && (
            <UserCard user={friendProfileQuery.data} name={username} isHeading withLinkToProfile />
          )}
        </div>
        <div className="col-sm-4 d-flex px-3 mb-2 flex-fill justify-content-sm-end">
          <RefreshProfile username={lowercaseUsername} />
        </div>
        {dataIsReady && (
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
      <div
        className={`ScrobbleList-container with-gradient${loading ? ' opacity-50' : ''}`}
        data-cy="FriendScrobbles-ScrobbleList"
      >
        <ScrobbleList compact noMenu analyticsEventForScrobbles="Scrobble from user" scrobbles={scrobbles}>
          <div className="mt-3 text-center">
            <Trans i18nKey="noSongsScrobbled">This user hasn&apos;t scrobbled anything yet!</Trans>
          </div>
        </ScrobbleList>
      </div>
    </>
  );
}
