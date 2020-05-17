import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import ScrobbleItem from 'components/ScrobbleItem';
import Spinner from 'components/Spinner';
import Pagination from 'components/Pagination';
import { fetchLastfmProfileHistory } from 'store/actions/userActions';

function ScrobbleList(props) {
  let albumHasVariousArtists = !props.isAlbum;
  const totalPages = parseInt(get(props.user, `profiles['${props.userToDisplay}'].totalPages`, 0));

  function navigateToPage(page) {
    props.fetchLastfmProfileHistory(props.userToDisplay, { page }, () => {
      if (props.containerRef) {
        props.containerRef.current.scrollTo(0, 0);
      }
    });
  }

  if (props.loading) {
    return (
      <Spinner />
    );
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
      return <ScrobbleItem
        scrobble={scrobble}
        analyticsEvent={props.analyticsEventForScrobbles}
        cloneScrobbleTo={props.cloneScrobblesTo}
        compact={props.compact}
        noMenu={props.noMenu}
        noCover={props.isAlbum}
        onSelect={props.onSelect}
        selected={props.selected && props.selected.indexOf(scrobble.uuid) > -1}
        key={(scrobble.timestamp || 0) + i}
        uuid={scrobble.uuid}
        muteArtist={props.isAlbum}
        hideArtist={!albumHasVariousArtists}
      />;
    });
    return (
      <div className="ScrobbleList">
        <div className={`d-flex ${props.isAlbum ? 'flex-column' : 'flex-column-reverse'}`}>
          {ScrobbleListContent}
        </div>
        {totalPages > 1 && (
          <Pagination onPageChange={navigateToPage} totalPages={totalPages} />
        )}
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
  containerRef: PropTypes.object,
  isAlbum: PropTypes.bool,
  loading: PropTypes.bool,
  noMenu: PropTypes.bool,
  onSelect: PropTypes.func,
  selected: PropTypes.array,
  scrobbles: PropTypes.array,
  userToDisplay: PropTypes.string,
  fetchLastfmProfileHistory: PropTypes.func,
  user: PropTypes.object,
};

ScrobbleList.defaultProps = {
  compact: false,
  isAlbum: false,
  loading: false,
  noMenu: false,
  scrobbles: [],
  fetchLastfmProfileHistory: () => {},
  user: {},
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  fetchLastfmProfileHistory: fetchLastfmProfileHistory(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  ScrobbleList
);
