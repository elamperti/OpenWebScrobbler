import React from 'react';
import PropTypes from 'prop-types';

import ScrobbleItem from 'components/ScrobbleItem';
import Spinner from 'components/Spinner';

function ScrobbleList(props) {
  let albumHasVariousArtists = !props.isAlbum;

  if (props.loading) {
    return <Spinner />;
  }

  if (props.scrobbles.length > 0) {
    if (props.isAlbum) {
      const albumArtistName = props.scrobbles[0].artist;

      for (let i = 1; i < props.scrobbles.length; i++) {
        if (props.scrobbles[i].artist !== albumArtistName) {
          albumHasVariousArtists = true;
          break;
        }
      }
    }

    const ScrobbleListContent = props.scrobbles.map((scrobble, i) => {
      return (
        <ScrobbleItem
          scrobble={scrobble}
          analyticsEvent={props.analyticsEventForScrobbles}
          cloneScrobbleTo={props.cloneScrobblesTo}
          compact={props.compact}
          noMenu={props.noMenu}
          noCover={props.isAlbum}
          onSelect={props.onSelect}
          selected={props.selected && props.selected.has(scrobble.uuid)}
          key={(scrobble.timestamp || 0) + i}
          uuid={scrobble.uuid}
          muteArtist={props.isAlbum}
          hideArtist={!albumHasVariousArtists}
        />
      );
    });
    return (
      <div className="ScrobbleList">
        <div className={`d-flex ${props.isAlbum ? 'flex-column' : 'flex-column-reverse'}`}>{ScrobbleListContent}</div>
      </div>
    );
  } else {
    return props.children;
  }
}

ScrobbleList.propTypes = {
  analyticsEventForScrobbles: PropTypes.string,
  children: PropTypes.node.isRequired,
  cloneScrobblesTo: PropTypes.func,
  compact: PropTypes.bool,
  isAlbum: PropTypes.bool,
  loading: PropTypes.bool,
  noMenu: PropTypes.bool,
  onSelect: PropTypes.func,
  selected: PropTypes.instanceOf(Set),
  scrobbles: PropTypes.array,
  fetchLastfmProfileHistory: PropTypes.func,
  user: PropTypes.object,
};

ScrobbleList.defaultProps = {
  compact: false,
  isAlbum: false,
  loading: false,
  noMenu: false,
  scrobbles: [],
};

export default ScrobbleList;
