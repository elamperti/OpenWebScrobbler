import React from 'react';
import { PropTypes } from 'prop-types';
import { translate, Trans } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompactDisc,
} from '@fortawesome/free-solid-svg-icons';

import ScrobbleItem from 'components/ScrobbleItem';

// ToDo: make stateless
class ScrobbleList extends React.Component {
  render() {
    if (this.props.loading) {
      return(
        <div className="text-center mt-5">
          <FontAwesomeIcon icon={faCompactDisc} color="var(--gray-light)" size="4x" spin />
          <br />
          <p className="mt-1">
            <Trans i18nKey="loading">Loading...</Trans>
          </p>
        </div>
      );
    }

    if (this.props.scrobbles.length > 0) {
      let ScrobbleListContent = this.props.scrobbles.map((scrobble, index) => {
        return <ScrobbleItem
          scrobble={scrobble}
          cloneScrobbleTo={this.props.cloneScrobblesTo}
          compact={this.props.compact}
          key={index}
        />;
      });
      return (
        <div className="ScrobbleList">
          <div className="d-flex flex-column-reverse">
            {ScrobbleListContent}
          </div>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

ScrobbleList.propTypes = {
  compact: PropTypes.bool,
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  scrobbles: PropTypes.array,
  cloneScrobblesTo: PropTypes.func,
};

ScrobbleList.defaultProps = {
  compact: false,
  loading: false,
  scrobbles: [],
};

export default translate(['common'])(ScrobbleList);
