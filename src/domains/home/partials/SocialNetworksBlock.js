import React from 'react';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faPatreon } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';

import './SocialNetworksBlock.scss';

export default function SocialNetworksBlock() {
  const { t } = useTranslation();

  return (
    <Row data-cy="SocialNetworkBlock" className="ows-SocialNetworkBlock">
      <Col md="6">
        <div data-cy="SocialNetworkBlock-discord" className="ows-social-discord jumbotron rounded">
          <Row>
            <Col xs="3" className="ows-logo">
              <FontAwesomeIcon icon={faDiscord} size="4x" className="d-block mx-auto" />
            </Col>
            <Col xs="9">
              <h4>{t('discord.title')}</h4>
              <p>{t('discord.copy')}</p>
              <Button
                outline
                type="secondary"
                size="sm"
                href="https://discord.gg/SEDp6Zy"
                className="float-end col-12 col-lg-6"
                data-cy="SocialNetworkBlock-discord-button"
              >
                {t('discord.CTA')}
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
      <Col md="6">
        <div data-cy="SocialNetworkBlock-patreon" className="ows-social-patreon jumbotron rounded">
          <Row>
            <Col xs="3" className="ows-logo">
              <FontAwesomeIcon icon={faPatreon} size="4x" className="d-block mx-auto" />
            </Col>
            <Col xs="9">
              <h4>{t('support.title')}</h4>
              <p>{t('support.copy')}</p>
              <Button
                outline
                type="secondary"
                size="sm"
                href="https://www.patreon.com/OpenScrobbler"
                className="float-end col-12 col-lg-6"
                data-cy="SocialNetworkBlock-patreon-button"
              >
                {t('support.CTA')}
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
}
