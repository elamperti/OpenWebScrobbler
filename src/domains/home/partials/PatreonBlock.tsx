import ReactGA from 'react-ga-neo';
import { Link } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { Trans } from 'react-i18next';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

import { useSettings } from 'hooks/useSettings';
import { PATREON_AUTH_URL } from 'Constants';

import './SocialNetworksBlock.scss';

export function PatreonBlock() {
  const { settings } = useSettings();
  const glowFF = useFeatureIsOn('glowing-support');
  const showSubscriptionFF = useFeatureIsOn('show-subscription');
  const connectPatreonFF = useFeatureIsOn('connect-patreon');
  const showConnectButton = connectPatreonFF && !settings?.patreonId;
  const showPatreonButton = !settings?.hasActiveSubscription;

  const onPatreonClick = () => {
    ReactGA.event({
      category: 'Patreon',
      action: 'Visit Patreon',
    });
  };

  const onLinkAccount = () => {
    ReactGA.event({
      category: 'Patreon',
      action: 'Link account intent (home)',
    });
    // eslint-disable-next-line react-compiler/react-compiler
    window.location.href = PATREON_AUTH_URL;
  };

  return (
    <div
      data-cy="SocialNetworkBlock-support"
      className={`ows-social-support jumbotron rounded${glowFF ? ' ows-glowing' : ''}${settings?.hasActiveSubscription ? ' ows-subscribed' : ''}`}
    >
      <Row>
        <Col xs="3" className="ows-logo">
          <FontAwesomeIcon icon={faHandHoldingHeart} size="4x" className="d-block mx-auto" />
        </Col>
        <Col xs="9">
          <h4>
            <Trans i18nKey={settings?.hasActiveSubscription ? 'support.thanksForSupporting' : 'support.title'}>
              Support this project
            </Trans>
          </h4>
          {!settings?.hasActiveSubscription && (
            <p>
              <Trans i18nKey="support.copy">
                Please consider becoming a patron to keep this site up and support development!
              </Trans>
              {showSubscriptionFF && (
                <>
                  {' '}
                  <Link to="/subscription" className="text-secondary">
                    <Trans i18nKey="learnMore">Learn more</Trans>
                  </Link>
                </>
              )}
            </p>
          )}

          {showPatreonButton && (
            <div className={`float-end col-12 ms-2 col-lg-6 ${glowFF ? ' ows-fancy-border' : ''}`}>
              <Button
                outline
                color="secondary"
                size="sm"
                href="https://www.patreon.com/OpenScrobbler"
                target="_blank"
                onClick={onPatreonClick}
                className="w-100"
                data-cy="SocialNetworkBlock-patreon-button"
              >
                <Trans i18nKey="support.CTA">Become a patron</Trans>
              </Button>
            </div>
          )}

          {showConnectButton && (
            <Button
              outline
              color="secondary"
              size="sm"
              className="float-end col-12 col-lg-5 mt-sm-2 mt-lg-0"
              data-cy="SocialNetworkBlock-patreon-connect"
              onClick={onLinkAccount}
            >
              <Trans i18nKey="support.connectAccount">Connect account</Trans>
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
}
