import React from 'react';
import { translate, Trans } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faFacebook,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';

import './Footer.css';

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <div className="container mt-3 mb-2">
          {/* <div className="row">
            <div className="col-sm-4">a</div>
            <div className="col-sm-4">x</div>
            <div className="col-sm-4">c</div>
          </div> */}
          <div className="social text-center my-2">
            <a title="Facebook" className="mx-2" href="https://facebook.com/OpenScrobbler">
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
            <a title="Twitter" className="mx-2" href="https://twitter.com/OpenScrobbler">
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>
            <a title="GitHub" className="mx-2" href="https://github.com/elamperti/openwebscrobbler">
              <FontAwesomeIcon icon={faGithub} size="2x" />
            </a>
          </div>
          <p className="text-center">
          <Trans i18nKey="footer.joinCommunity">
            You are welcome to join our community <a href="https://discord.gg/vcbprTz">on Discord</a>!
          </Trans>
          &nbsp;
          <Trans i18nKey="footer.supportThisProject">
            Please <a href="https://www.patreon.com/OpenScrobbler">support this project</a> on Patreon :)
          </Trans>
          <br />
          <Trans i18nKey="footer.specialThanks">
            Special thanks to all our supporters, translators and <a href="https://github.com/elamperti/OpenWebScrobbler/graphs/contributors">contributors</a>
          </Trans> ❤ <span className="app-version">v{process.env.REACT_APP_VERSION}</span>
          </p>
        </div>
      </footer>
    );
  }
}

export default translate(['common'])(Footer);
