import type { Album } from 'utils/types/album';

import AlbumCard from 'components/AlbumCard';
import { MouseEventHandler } from 'react';
import { Row } from 'reactstrap';


export default function AlbumList({
  albums = [],
  className = '',
  onClick,
}: {
  albums: Album[];
  className: string;
  onClick: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Row className="listOfAlbums mb-4" data-cy="AlbumList">
      {albums.map((album, i) => (
        <div className={className} key={i}>
          <a href={album.url} data-album-index={i} onClick={onClick}>
            <AlbumCard
              artist={album.artist}
              name={album.name || ''}
              background={album.cover}
              sizes={album.coverSizes}
              year={album.releasedate || null}
              className="mt-4"
              interactive
            />
          </a>
        </div>
      ))}
    </Row>
  );
}
