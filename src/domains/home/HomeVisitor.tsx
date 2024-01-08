import { Trans, useTranslation } from 'react-i18next';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faLastfm } from '@fortawesome/free-brands-svg-icons';
import SocialNetworksBlock from './partials/SocialNetworksBlock';
import WelcomeBlock from './partials/WelcomeBlock';

import './HomeVisitor.scss';

const logIn = () => {
  window.location.href =
    `https://www.last.fm/api/auth/?api_key=${process.env.REACT_APP_LASTFM_API_KEY}` +
    `&cb=${window.location.protocol}//${window.location.host}/`;
};

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Row data-cy="HomeVisitor">
        <Col lg="7" xl="8">
          <div className="jumbotron rounded px-3 px-sm-4 py-3 py-sm-5">
            <WelcomeBlock />
            <p className="text-center">{t('authNeeded')}</p>
            <p className="lead text-center">
              <Button onClick={logIn} size="lg" color="danger">
                <FontAwesomeIcon icon={faLastfm} color="white" /> {t('logInWithLastFm')}
              </Button>
              <small className="text-muted text-copy d-block mt-1">
                <FontAwesomeIcon icon={faLock} /> {t('logInIsSafe')}
              </small>
            </p>
          </div>
        </Col>
        <Col lg="5" xl="4">
          <div data-cy="HomeVisitor-about" className="jumbotron rounded px-3 px-sm-4 py-3 py-sm-5 ows-Home-about">
            <h4>
              <Trans t={t} i18nKey="about.title">
                What is this?
              </Trans>
            </h4>
            <p>{t('about.description')}</p>
            <img
              src="/img/screenshot-180915-sm.webp"
              alt="Application screenshot"
              className="img-fluid d-none d-lg-block img-thumbnail mx-auto mb-2"
            />
          </div>
        </Col>
      </Row>
      <SocialNetworksBlock />
    </>
  );
}
