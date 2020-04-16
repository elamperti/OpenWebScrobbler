import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Jumbotron, Button, Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faLastfm } from '@fortawesome/free-brands-svg-icons'
import { logIn } from 'store/actions/userActions'
import SocialNetworksBlock from './partials/SocialNetworksBlock'
import WelcomeBlock from './partials/WelcomeBlock'

import './HomeVisitor.scss'

export default function Home() {
  const {t} = useTranslation()

  return (
    <React.Fragment>
      <Row data-cy="HomeVisitor">
        <Col lg="7">
          <Jumbotron>
            <WelcomeBlock />
            <p className="text-center">{t('authNeeded')}</p>
            <p className="lead text-center">
              <Button onClick={() => logIn()()} size="lg" color="danger">
                <FontAwesomeIcon icon={faLastfm} color="white" /> {t('logInWithLastFm')}
              </Button>
              <small className="text-muted text-copy d-block mt-1">
                <FontAwesomeIcon icon={faLock} /> {t('logInIsSafe')}
              </small>
            </p>
          </Jumbotron>
        </Col>
        <Col lg="5">
          <Jumbotron data-cy="HomeVisitor-about" className="ows-Home-about">
            <h4><Trans t={t} i18nKey="about.title">What is this?</Trans></h4>
            <p>{t('about.description')}</p>
            <img src="/img/screenshot-180915-sm.webp" alt="Application screenshot" className="img-fluid d-none d-lg-block img-thumbnail mx-auto mb-2" />
          </Jumbotron>
        </Col>
      </Row>
      <SocialNetworksBlock />
    </React.Fragment>
  )
}
