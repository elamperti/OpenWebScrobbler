import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'components/Avatar';

import './ArtistCard.css';

const ArtistCard = ({
  artist,
  artistId,
  className,
  onClick,
}) => (
  <div className={`artistCard ${className} my-2 py-2 rounded`}>
    <a href={artist.url} className="ml-2 row h-100 align-items-center" data-artist-id={artistId} onClick={onClick}>
      <Avatar user={artist} size="sm" alt={artist.name} isArtist />
      <span className="artistCard-name pl-3">{artist.name}</span>
    </a>
  </div>
);

ArtistCard.propTypes = {
  artist: PropTypes.object.isRequired,
  artistId: PropTypes.oneOf(PropTypes.number, PropTypes.string),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

ArtistCard.defaultProps = {
  className: '',
};

export default ArtistCard;
