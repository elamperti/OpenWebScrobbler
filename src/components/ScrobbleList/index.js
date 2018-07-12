import React from 'react';
import { PropTypes } from 'prop-types';
import { translate } from 'react-i18next';

import ScrobbleItem from 'components/ScrobbleItem';

import { Jumbotron } from 'reactstrap';

import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faUserAstronaut from '@fortawesome/fontawesome-free-solid/faUserAstronaut';
import faQuestion from '@fortawesome/fontawesome-free-solid/faQuestion';
// import faPatreon from '@fortawesome/fontawesome-free-brands/faPatreon';

class ScrobbleList extends React.Component {
  render() {
    const t = this.props.t; // Translations
    let ScrobbleListContent;
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

    return (
      <div className="ScrobbleList d-flex flex-column-reverse">
        {ScrobbleListContent}
        {/* {this.props.user.isDonor ? null : donationCTA} */}
      </div>
    );
  }
}

ScrobbleList.propTypes = {
  scrobbles: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    scrobbles: state.scrobbles.list,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  translate(['common'])(ScrobbleList)
);
