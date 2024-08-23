import ReactGA from 'react-ga-neo';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { Trans } from 'react-i18next';

import './SocialNetworksBlock.scss';
import { PatreonBlock } from './PatreonBlock';

export default function SocialNetworksBlock() {
  const onDiscordClick = () => {
    ReactGA.event({
      category: 'Discord',
      action: 'Join Discord intent',
    });
  };

  return (
    <Row data-cy="SocialNetworkBlock" className="ows-SocialNetworkBlock">
      <Col className="order-sm-last order-md-first" md="6">
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
        <PatreonBlock />
      </Col>
    </Row>
  );
}
