import React from 'react';
import { PropTypes } from 'prop-types';
import { translate, Trans } from 'react-i18next';

import { Button, Jumbotron } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserAstronaut,
  faQuestion,
  faBroom,
} from '@fortawesome/free-solid-svg-icons';
// import {
//   faPatreon,
// } from '@fortawesome/free-brands-svg-icons';

import ScrobbleItem from 'components/ScrobbleItem';

import './ScrobbleList.css';

class ScrobbleList extends React.Component {
  render() {
    const t = this.props.t; // Translations
    let ScrobbleListContent;
    let clearListButton;
    // let donationCTA;
    // donationCTA = (
    //   <div className="donation-cta">
    //     <a href="https://www.patreon.com/OpenScrobbler" rel="noopener">{t('considerDonating')}</a>
    //     <FontAwesomeIcon icon={faPatreon} />
    //   </div>
    // );

    if (this.props.scrobbles.length > 0) {
      ScrobbleListContent = this.props.scrobbles.map((scrobble, index) => {
        return <ScrobbleItem
          scrobble={scrobble}
          key={index}
        />;
      });

    } else {
      ScrobbleListContent = (
        <Jumbotron className="text-center">
          <div className="d-flex align-items-start justify-content-center mb-2">
            <FontAwesomeIcon icon={faUserAstronaut} color="var(--gray-dark)" size="6x" />
            <FontAwesomeIcon icon={faQuestion} color="var(--gray-dark)" size="2x" transform="shrink-4" />
          </div>
          <strong>{t('noSongsScrobbled')}</strong><br />
          {t('songsWillAppearHere')}
        </Jumbotron>
      );
    }

    if (this.props.clearList && this.props.scrobbles.length > 0) {
      clearListButton = (
        <div className="mb-2 text-right">
          <Button className="btn-clear" size="sm" color="secondary" onClick={this.props.clearList}>
            <FontAwesomeIcon icon={faBroom} className="mr-1" />
              <Trans i18nKey="clearHistory">Clear history</Trans>
          </Button>
        </div>
      );
    }

    return (
      <div className="ScrobbleList">
        { clearListButton }
        <div className="d-flex flex-column-reverse">
          {ScrobbleListContent}
          {/* {this.props.user.isDonor ? null : donationCTA} */}
        </div>
      </div>
    );
  }
}

ScrobbleList.propTypes = {
  scrobbles: PropTypes.array,
  clearList: PropTypes.func,
};

ScrobbleList.defaultProps = {
  scrobbles: [],
  clearList: null,
};

export default translate(['common'])(ScrobbleList);
