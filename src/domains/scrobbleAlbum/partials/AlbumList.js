import React from 'react';
import PropTypes from 'prop-types';

import { Row } from 'reactstrap';
import AlbumCard from 'components/AlbumCard';

export default function AlbumList({ albums = [], className, onClick }) {
  return (
    <Row className="mb-4">
      {albums.map((album, i) => (
        <div className={`listOfAlbums ${className}`} key={i}>
          <a href={album.url} data-album-index={i} onClick={onClick}>
            <AlbumCard artist={album.artist} name={album.name} background={album.cover} className="mt-4" interactive />
          </a>
        </div>
      ))}
    </Row>
  );
}

AlbumList.propTypes = {
  albums: PropTypes.array.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
