import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'components/Avatar';

import './ArtistCard.css';

const ArtistCard = props => {
  return (
    <div className={`artistCard ${props.className} my-2 py-2 rounded`}>
      <a href={props.artist.url} onClick={props.onClick} className="row h-100 align-items-center">
        <div className="col-3">
          <Avatar user={props.artist} size="md" alt={props.artist.name} />
        </div>
        <div className="col-9 artistCard-name pl-4">
          {props.artist.name}
        </div>
      </a>
    </div>
  );
};

ArtistCard.propTypes = {
  artist: PropTypes.object.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

ArtistCard.defaultProps = {
  className: '',
};

export default ArtistCard;
