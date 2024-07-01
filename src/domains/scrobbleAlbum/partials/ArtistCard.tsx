import type { MouseEventHandler } from 'react';
import type { Artist } from 'utils/types/artist';

import Avatar from 'components/Avatar';

import './ArtistCard.css';


const ArtistCard = ({
  artist,
  artistId,
  className = '',
  onClick,
}: {
  artist: Artist;
  artistId: number;
  className: string;
  onClick: MouseEventHandler<HTMLAnchorElement>;
}) => {
  return (
    <div className={`artistCard ${className} my-2 py-2 rounded`} data-cy="ArtistCard">
      <a href={artist.url} className="ms-2 d-flex h-100 align-items-center" data-artist-id={artistId} onClick={onClick}>
        <Avatar url={artist.avatar?.sm} size="sm" alt={artist.name} isArtist />
        <span className="artistCard-name ps-3">{artist.name}</span>
      </a>
    </div>
  );
};

export default ArtistCard;
