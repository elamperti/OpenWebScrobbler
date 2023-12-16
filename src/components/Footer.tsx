import { useLocation } from 'react-router-dom';
import { Trans } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faDiscord, faPatreon } from '@fortawesome/free-brands-svg-icons';

import './Footer.css';

function Footer() {
  const location = useLocation();

  return (
    <footer>
      <div className="container mt-3 mb-2">
        <div className="social text-center my-2">
          <a title="GitHub" className="mx-2" href="https://github.com/elamperti/openwebscrobbler">
            <FontAwesomeIcon icon={faGithub} size="2x" />
          </a>
          <a title="Discord" className="mx-2" href="https://discord.gg/SEDp6Zy" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faDiscord} size="2x" />
          </a>
          <a title="Patreon" className="mx-2" href="https://www.patreon.com/OpenScrobbler">
            <FontAwesomeIcon icon={faPatreon} size="2x" />
          </a>
        </div>
        {location.pathname !== '/' && (
          <p className="text-center mb-1">
            {/* <Trans i18nKey="footer.joinCommunity">
                You are welcome to join our community <a href="https://discord.gg/vcbprTz">on Discord</a>!
              </Trans>
              &nbsp; */}
            <Trans i18nKey="footer.supportThisProject">
              Please <a href="https://www.patreon.com/OpenScrobbler">support this project</a> on Patreon :)
            </Trans>
          </p>
        )}

        <p className="text-center">
          <Trans i18nKey="footer.specialThanks">
            {'Special thanks to all our supporters, translators and '}
            <a href="https://github.com/elamperti/OpenWebScrobbler/graphs/contributors">contributors</a>
          </Trans>
          {' ❤ '}
          <br />
          <span className="app-version">v{process.env.REACT_APP_VERSION}</span>
          {/* {' • '}
          <a href="//status.openscrobbler.com/" target="_blank" rel="noreferrer">
            Status
          </a> */}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
