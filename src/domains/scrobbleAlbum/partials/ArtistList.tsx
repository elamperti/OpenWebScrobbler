import type { MouseEventHandler } from 'react';

import { Row } from 'reactstrap';
import { Artist } from 'utils/types/artist';

import ArtistCard from './ArtistCard';


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
