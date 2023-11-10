import { Row } from 'reactstrap';
import ArtistCard from './ArtistCard';
import { Artist } from 'utils/types/artist';

import type { MouseEventHandler } from 'react';

export default function ArtistList({
  artists = [],
  onClick,
}: {
  artists: Artist[];
  onClick: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Row data-cy="ArtistList-container">
      {artists.slice(0, 20).map((artist, i) => (
        <ArtistCard artist={artist} artistId={i} key={i} onClick={onClick} className="col-12" />
      ))}
    </Row>
  );
}
