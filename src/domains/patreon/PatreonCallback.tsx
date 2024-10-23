import { useEffect, useState } from 'react';
import qs from 'qs';
import { Trans } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useSettings } from 'hooks/useSettings';
import { openscrobblerAPI } from 'utils/clients/api/apiClient';
import { ProgressItem } from 'components/ProgressItem';
import { createAlert } from 'store/actions/alertActions';

export function PatreonCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isReady: settingsReady } = useSettings();
  const [currentStatus, setStatus] = useState('fetching');
  const [errorData, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const queryString = qs.parse(location.search, { ignoreQueryPrefix: true });

    if (queryString.code) {
      const code = queryString.code as string;
      setStatus('verifying');

      const params = new URLSearchParams();
      params.append('method', 'callback');
      params.append('code', code);

      openscrobblerAPI
        .post('/patreon.php', params)
        .then((response) => {
          if (response.data.status === 'ok') {
            setStatus('success');
            queryClient.invalidateQueries({
              queryKey: ['user', 'settings'],
            });
          } else {
            setStatus('error');
            if (response.data.error) {
              setError(response.data);
            }
          }
        })
        .catch(({ response }) => {
          setError(response.data);
          setStatus('error');
        });
    }
  }, [queryClient, location]);

  useEffect(() => {
    if (currentStatus === 'success' && settingsReady) {
      setTimeout(() => {
        dispatch(createAlert({ type: 'success', message: 'patreonConnectionSuccess' }));
        navigate('/', { state: { keepAlerts: true } });
      }, 500); // This is just so the user sees everyting is ok
    }
  }, [dispatch, navigate, currentStatus, settingsReady]);

  return (
    <div className="mt-3 mt-sm-2" data-cy="Callback-container">
      <h3 className="mb-3 text-center">
        <Trans i18nKey="connectingToPatreon">Connecting to Patreon...</Trans>
      </h3>

      <div className="row px-4">
        <div className="d-block jumbotron rounded  px-3 px-sm-4 py-3 py-sm-5 py-md-4 col-12 offset-0 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
          {/* Token verification */}
          <ProgressItem
            isLoading={currentStatus === 'verifying'}
            isError={currentStatus === 'error'}
            isDone={currentStatus === 'success'}
          >
            <Trans i18nKey="verifyingPatreonAccount">Verifying Patreon account</Trans>
          </ProgressItem>

          {/* Settings endpoint */}
          <ProgressItem isLoading={currentStatus === 'success'} isDone={currentStatus === 'success' && settingsReady}>
            <Trans i18nKey="connectingAccounts">Connecting accounts</Trans>
          </ProgressItem>

          {/* Error block */}
          {currentStatus === 'error' && errorData && (
            <div className="mt-3" data-cy="Callback-issues-block">
              <div className="border border-secondary rounded px-3 py-2">
                <h4 className="text-danger">
                  <Trans i18nKey="validationFailed">Something went wrong!</Trans>
                </h4>
                <p className="mb-0">
                  <>
                    <strong>Code</strong>: {errorData.error}
                    <br />
                    <strong>Details</strong>: {errorData.message}
                  </>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
