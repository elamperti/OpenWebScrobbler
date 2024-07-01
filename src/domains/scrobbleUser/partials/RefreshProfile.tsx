import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQueryClient } from '@tanstack/react-query';
import { Trans } from 'react-i18next';
import { Button } from 'reactstrap';


export default function RefreshProfile({ username }: { username: string }) {
  const queryClient = useQueryClient();

  if (!username) return null;

  const invalidateUserScrobbles = () => {
    queryClient.invalidateQueries({
      queryKey: ['profile', username, 'scrobbles'],
    });
  };

  return (
    <Button className="align-self-center w-100" onClick={invalidateUserScrobbles}>
      <FontAwesomeIcon icon={faSync} /> <Trans i18nKey="refresh">Refresh</Trans>
    </Button>
  );
}
