import qs from 'qs';
import ReactGA from 'react-ga-neo';
import { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';

import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserData } from 'hooks/useUserData';
import { useSettings } from 'hooks/useSettings';

import { validateLastfmToken } from 'utils/clients/api/methods/validateLastfmToken';
import { logout } from 'utils/clients/api/methods/logout';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import Spinner from 'components/Spinner';
import { ProgressItem } from 'components/ProgressItem';

import { LASTFM_AUTH_URL } from 'Constants';

function logoutAndTryAgain(e) {
  e.preventDefault();
  ReactGA.event({
    category: 'Lastfm Login',
    action: 'Retry',
  });
  logout().finally(() => {
    window.location.href = LASTFM_AUTH_URL;
  });
}

export function Callback() {
  const [lastfmToken, setLastfmToken] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useUserData();
  const settings = useSettings();
  const validation = useQuery({
    queryKey: ['lastfm', 'callback', lastfmToken],
    queryFn: () =>
      validateLastfmToken(lastfmToken).then((data) => {
        if (data.success) {
          queryClient.invalidateQueries({
            queryKey: ['user'],
          });
        }
        return data;
      }),
    staleTime: Infinity,
    enabled: !!lastfmToken,
  });

  useEffect(() => {
    if (!user.isReady) return;

    if (location.search && !user.isLoggedIn) {
      const queryString = qs.parse(location.search, { ignoreQueryPrefix: true });
      setLastfmToken((queryString.token as string) || '');
    } else if (!lastfmToken) {
      navigate('/', { state: { keepAlerts: true } });
    }
    // Including `navigate` in this array causes a bug in album search, see #220
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.isReady, user.isLoading, user.isLoggedIn, location.search]);

  useEffect(() => {
    // note: to prevent redirect when settings fails, add `&& settings.isSuccess`
    if (lastfmToken && user.isLoggedIn && validation.isSuccess && settings.isReady) {
      ReactGA.event({
        category: 'Lastfm Login',
        action: 'Success',
      });
      setTimeout(() => {
        navigate('/', { state: { keepAlerts: true } });
      }, 500); // This is just so the user sees everything is ok
    }
  }, [lastfmToken, user, validation, settings, navigate]);

  // Show a spinner while we check if the user is already logged in
  if (!lastfmToken) {
    return (
      <div data-cy="Callback-Spinner">
        <Spinner />
      </div>
    );
  }

  // Error conditions for each block (yes, this is awful)
  const validationFailed = validation.isError || (validation.data && validation.data.success === false);
  const userFailed =
    validation.isFetched && validation.data?.success && ((user.isReady && !user.isLoggedIn) || user.isError);
  const settingsFailed = user.isLoggedIn && settings.isError;

  if (validationFailed || userFailed || settingsFailed) {
    ReactGA.event({
      category: 'Lastfm',
      action: 'Login',
      label: validationFailed ? 'Rejected' : 'Failed',
    });
  }

  return (
    <div className="mt-3 mt-sm-2" data-cy="Callback-container">
      <h3 className="mb-3 text-center">
        <Trans i18nKey="startingSession">Logging you in...</Trans>
      </h3>

      <div className="row px-4">
        <div className="d-block jumbotron rounded  px-3 px-sm-4 py-3 py-sm-5 py-md-4 col-12 offset-0 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
          {/* Last.fm auth */}
          <ProgressItem isLoading={!validation.isSuccess} isError={validationFailed} isDone={validation.data?.success}>
            <Trans i18nKey="finishingValidation">Validating token with Last.fm</Trans>
          </ProgressItem>

          {/* User endpoint */}
          <ProgressItem
            isLoading={user.isFetching}
            isError={userFailed}
            isDone={validation.isSuccess && user.isLoggedIn}
          >
            <Trans i18nKey="gettingLastfmUser">Getting Last.fm user details</Trans>
          </ProgressItem>

          {/* Settings endpoint */}
          <ProgressItem
            isLoading={settings.isFetching}
            isError={settings.isError}
            isDone={validation.isSuccess && user.isLoggedIn && settings.isReady}
          >
            <Trans i18nKey="fetchingUserSettings">Retrieving your preferences</Trans>
          </ProgressItem>

          {/* Error block */}
          {(validationFailed || userFailed || settingsFailed) && (
            <div className="mt-3" data-cy="Callback-issues-block">
              <div className="border border-secondary rounded px-3 py-2 mb-3">
                <h4 className="text-danger">
                  <Trans i18nKey="validationFailed">Something went wrong!</Trans>
                </h4>
                <p className="mb-0">
                  {validationFailed && (
                    <>
                      <strong>Code</strong>: {validation.data?.error?.code}
                      <br />
                      <strong>Details</strong>: {validation.data?.error?.message}
                    </>
                  )}
                  {(userFailed || settingsFailed) && (
                    <Trans i18nKey="loginError.message">There was an unexpected error logging in.</Trans>
                  )}
                </p>
              </div>
              {!settingsFailed && (
                <div className="ms-2 text-end">
                  <a
                    href={LASTFM_AUTH_URL}
                    className="btn btn-sm py-2 px-3 btn-primary border border-primary"
                    data-cy="Callback-try-again"
                    onClick={logoutAndTryAgain}
                  >
                    <Trans i18nKey="tryAgain">Try again</Trans>
                    <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
