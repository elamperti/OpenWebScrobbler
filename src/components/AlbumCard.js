import React from 'react';
import PropTypes from 'prop-types';
import random from 'lodash/random';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import './AlbumCard.css';

const AlbumCard = ({ background, sizes, name, artist, className, year, interactive }) => {
  const albumCardStyle = {};
  let srcset;

  if (background) {
    albumCardStyle.backgroundColor = '#A0A0A0';
    if (sizes && background.lg) {
      srcset = `${background.sm} ${sizes.sm}w, ${background.lg} ${sizes.lg}w`;
    }
  } else {
    albumCardStyle.backgroundColor = `hsl(${random(0, 359)},50%,30%)`;
  }

  const albumCaption = name && (
    <div className="albumCard-caption px-3 pb-2">
      {year && (
        <React.Fragment>
          <small className="albumCard-year badge badge-secondary">{year}</small>
          <br />
        </React.Fragment>
      )}
      <strong className="albumCard-title">{name}</strong>
      <br />
      <span className="albumCard-artist">{artist}</span>
    </div>
  );

  const albumArt = background && (
    <LazyLoadImage className="albumArt" src={background.sm} srcSet={srcset} alt={name} effect="opacity" />
  );

  return (
    <div className={`albumCard ${className} ${interactive && 'interactive'}`} style={albumCardStyle}>
      {albumArt}
      {albumCaption}
    </div>
  );
};

AlbumCard.propTypes = {
  artist: PropTypes.string,
  background: PropTypes.object.isRequired, // ToDo: better check for sm/lg and values
  sizes: PropTypes.object,
  className: PropTypes.string,
  interactive: PropTypes.bool,
  name: PropTypes.string,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

AlbumCard.defaultProps = {
  interactive: false,
  className: '',
};

export default AlbumCard;
