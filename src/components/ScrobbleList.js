import React from 'react';
import { PropTypes } from 'prop-types';

import ScrobbleItem from 'components/ScrobbleItem';
import Spinner from 'components/Spinner';

// ToDo: make stateless
class ScrobbleList extends React.Component {
  render() {
    if (this.props.loading) {
      return(
        <Spinner />
      );
    }

    if (this.props.scrobbles.length > 0) {
      let ScrobbleListContent = this.props.scrobbles.map((scrobble, index) => {
        return <ScrobbleItem
          scrobble={scrobble}
          cloneScrobbleTo={this.props.cloneScrobblesTo}
          compact={this.props.compact}
          noMenu={this.props.noMenu}
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
  noMenu: PropTypes.bool,
  scrobbles: PropTypes.array,
  cloneScrobblesTo: PropTypes.func,
};

ScrobbleList.defaultProps = {
  compact: false,
  loading: false,
  noMenu: false,
  scrobbles: [],
};

export default ScrobbleList;
