import { useQueryClient } from '@tanstack/react-query';

import { Button } from 'reactstrap';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

export default function RefreshProfile({ username }: { username: string }) {
  const queryClient = useQueryClient();

  if (!username) return null;

  const invalidateUserScrobbles = () => {
    queryClient.invalidateQueries({
      queryKey: ['user', username, 'scrobbles'],
    });
  };

  return (
    <Button className="align-self-center w-100" onClick={invalidateUserScrobbles}>
      <FontAwesomeIcon icon={faSync} /> <Trans i18nKey="refresh">Refresh</Trans>
    </Button>
  );
}
