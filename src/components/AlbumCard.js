import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import random from 'lodash/random';

import './AlbumCard.css';

const AlbumCard = props => {
  let albumCardStyle = {};

  if (props.background) {
    albumCardStyle.backgroundImage = `url("${props.background}")`;
  } else {
    albumCardStyle.backgroundColor = `hsl(${random(0, 359)},50%,30%)`;
  }

  const albumCaption = (props.name &&
    <div className="albumCard-caption px-3 pb-2">
      <strong className="albumCard-title">{props.name}</strong>
      <br />
      <span className="albumCard-artist">{props.artist}</span>
    </div>
  );

  return (
    <div className={`albumCard ${props.className} ${props.interactive && 'interactive'}`} style={albumCardStyle}>
      {albumCaption}
    </div>
  );
};

AlbumCard.propTypes = {
  artist: PropTypes.string,
  background: PropTypes.string.isRequired,
  className: PropTypes.string,
  interactive: PropTypes.bool,
  name: PropTypes.string,
};

AlbumCard.defaultProps = {
  interactive: false,
  className: '',
};

export default translate(['common'])(AlbumCard);
