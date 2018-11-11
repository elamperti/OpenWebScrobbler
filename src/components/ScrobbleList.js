import React from 'react';
import { PropTypes } from 'prop-types';

import ScrobbleItem from 'components/ScrobbleItem';
import Spinner from 'components/Spinner';

function ScrobbleList(props) {
  if (props.loading) {
    return(
      <Spinner />
    );
  }

  if (props.scrobbles.length > 0) {
    let ScrobbleListContent = props.scrobbles.map((scrobble, index) => {
      return <ScrobbleItem
        scrobble={scrobble}
        cloneScrobbleTo={props.cloneScrobblesTo}
        compact={props.compact}
        noMenu={props.noMenu}
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
    return props.children;
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
