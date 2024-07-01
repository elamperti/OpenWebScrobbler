import { faChevronLeft, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQueryClient } from '@tanstack/react-query';
import SearchForm from 'components/SearchForm';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Row, Button } from 'reactstrap';
import { usernameIsValid } from 'utils/common';


export function UserResultsHeading({ isLoading, userToSearch }: { isLoading: boolean; userToSearch: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const switchUserQuery = (newUser: string) => {
    queryClient.cancelQueries({ queryKey: ['profile'] });
    navigate(`/scrobble/user/${newUser}`);
  };

  return (
    <Row className="mb-3">
      <div className="col-md-8 d-flex align-items-center">
        <Button onClick={() => navigate('/scrobble/user', { state: { userToSearch } })} size="sm" className="me-3">
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
          validator={usernameIsValid}
          feedbackMessageKey="invalidUsername"
        />
      </div>
    </Row>
  );
}
