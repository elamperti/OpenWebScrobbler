import React from 'react';
import PropTypes from 'prop-types';

import { Row } from 'reactstrap';
import ArtistCard from 'components/ArtistCard';

export default function ArtistList({ artists = [], onClick }) {
  return (
    <Row data-cy="ArtistList-container">
      {artists.slice(0, 20).map((artist, i) => (
        <ArtistCard artist={artist} artistId={i} key={i} onClick={onClick} className="col-12" />
      ))}
    </Row>
  );
}

ArtistList.propTypes = {
  artists: PropTypes.array.isRequired,
  onClick: PropTypes.func,
};
