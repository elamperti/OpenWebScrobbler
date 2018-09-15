import React, { Component } from 'react';
import { connect } from 'react-redux';
import i18n, { languageList, fallbackLng } from '../i18n'; // to handle hl parameter
import { translate, Trans } from 'react-i18next';
import qs from 'qs';

import { Link } from 'react-router-dom';
import { Jumbotron, Button, Row, Col } from 'reactstrap';

import { logIn, authUserWithToken } from 'store/actions/userActions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faLock from '@fortawesome/fontawesome-free-solid/faLock';
import faLastfm from '@fortawesome/fontawesome-free-brands/faLastfm';
import faDiscord from '@fortawesome/fontawesome-free-brands/faDiscord';
import faPatreon from '@fortawesome/fontawesome-free-brands/faPatreon';

const bodyDecoration = 'with-shadow';

class Home extends Component {
  constructor(props) {
    super(props);
    if (this.props.location.search) {
      let token = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).token || null;
      if (token) {
        this.props.authUserWithToken(token);
        this.props.history.push('/');
      }

      if (this.props.lang === 'auto') {
        let suggestedLang = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).hl || null;
        if (suggestedLang) {
          let langFound;

          for (let lang of languageList) {
            if (suggestedLang === lang.code) {
              langFound = true;
              break;
            }
          }

          if (langFound || fallbackLng.hasOwnProperty(suggestedLang)) {
            i18n.changeLanguage(suggestedLang);
          }
        }
      }
    }
  }

  componentDidMount() {
    document.body.classList.add(bodyDecoration);
  }

  componentWillUnmount() {
    document.body.classList.remove(bodyDecoration);
  }

  render() {
    const t = this.props.t; // Translations

    let homeContent;

    if (this.props.user.isLoggedIn) {
      homeContent = (
        <div>
          <p className="lead text-center">
            <Button tag={Link} to="/scrobble/song" size="lg" color="success">
              {t('getScrobbling')}
            </Button>
          </p>
        </div>
      )
    } else {
      homeContent = (
        <div>
            <p className="text-center">{t('authNeeded')}</p>
            <p className="lead text-center">
              <Button onClick={this.props.logIn} size="lg" color="danger">
                <FontAwesomeIcon icon={faLastfm} color="white" /> {t('logInWithLastFm')}
              </Button>
              <br />
              <small className="text-muted text-copy">
                <FontAwesomeIcon icon={faLock} /> {t('logInIsSafe')}
              </small>
            </p>
        </div>
      )
    }

    return (
      <div>
        <Jumbotron>
          <h1 className="display-4">
            <Trans i18nKey="welcomeToTheScrobbler">
              Welcome to the <span className="ows-title">Open Scrobbler</span>!
            </Trans>
          </h1>
          <p className="lead">
            {t('purpose')}
          </p>
          <br />
          {homeContent}
        </Jumbotron>
        <Row>
            <Col sm="6">
              <Jumbotron className="alternative-content discord">
                <Row>
                  <Col xs="3" sm="3" className="logo">
                    <FontAwesomeIcon icon={faDiscord} size="4x" className="d-block mx-auto" />
                  </Col>
                  <Col xs="9" sm="9">
                    <h4>{t('discord.title')}</h4>
                    <p>{t('discord.copy')}</p>
                    <Button outline type="secondary" size="sm" href="https://discord.gg/SEDp6Zy" className="float-right col-12 col-md-8 col-lg-6 col-xl-4">
                      {t('discord.CTA')}
                    </Button>
                  </Col>
                </Row>
              </Jumbotron>
            </Col>
            <Col sm="6">
              <Jumbotron className="alternative-content patreon">
                <Row>
                  <Col xs="3" sm="3" className="logo">
                    <FontAwesomeIcon icon={faPatreon} size="4x" className="d-block mx-auto" />
                  </Col>
                  <Col xs="9" sm="9">
                    <h4>{t('support.title')}</h4>
                    <p>{t('support.copy')}</p>
                    <Button outline type="secondary" size="sm" href="https://www.patreon.com/OpenScrobbler" className="float-right col-12 col-md-8 col-lg-6 col-xl-4">
                      {t('support.CTA')}
                    </Button>
                  </Col>
                </Row>
              </Jumbotron>
            </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    lang: state.settings.lang,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: logIn(dispatch),
    authUserWithToken: authUserWithToken(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  translate(['home'])(Home)
);
