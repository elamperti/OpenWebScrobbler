import ReactGA from 'react-ga-neo';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { Trans } from 'react-i18next';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

import './SocialNetworksBlock.scss';

export default function SocialNetworksBlock() {
  const glowFF = useFeatureIsOn('glowing-support');

  const onPatreonClick = () => {
    ReactGA.event({
      category: 'Patreon',
      action: 'Visit Patreon',
    });
  };

  const onDiscordClick = () => {
    ReactGA.event({
      category: 'Discord',
      action: 'Join Discord intent',
    });
  };

  return (
    <Row data-cy="SocialNetworkBlock" className="ows-SocialNetworkBlock">
      <Col md="6">
        <div data-cy="SocialNetworkBlock-discord" className="ows-social-discord jumbotron rounded">
          <Row>
            <Col xs="3" className="ows-logo">
              <FontAwesomeIcon icon={faDiscord} size="4x" className="d-block mx-auto" />
            </Col>
            <Col xs="9">
              <h4>
                <Trans i18nKey="discord.title">Join us on Discord</Trans>
              </h4>
              <p>
                <Trans i18nKey="discord.copy">Stay connected with other music fans!</Trans>
              </p>
              <Button
                outline
                color="secondary"
                size="sm"
                onClick={onDiscordClick}
                href="https://discord.gg/SEDp6Zy"
                className="float-end col-12 col-lg-6"
                data-cy="SocialNetworkBlock-discord-button"
              >
                <Trans i18nKey="discord.CTA">Join Discord</Trans>
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
      <Col md="6">
        <div
          data-cy="SocialNetworkBlock-support"
          className={`ows-social-support jumbotron rounded${glowFF ? ' ows-glowing' : ''}`}
        >
          <Row>
            <Col xs="3" className="ows-logo">
              <FontAwesomeIcon icon={faHandHoldingHeart} size="4x" className="d-block mx-auto" />
            </Col>
            <Col xs="9">
              <h4>
                <Trans i18nKey="support.title">Support this project</Trans>
              </h4>
              <p>
                <Trans i18nKey="support.copy">
                  Please consider becoming a patron to keep this site up and support development!
                </Trans>
              </p>

              <div className={`float-end col-12 col-lg-6 ${glowFF ? ' ows-fancy-border' : ''}`}>
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
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
}
