import { random } from 'lodash-es';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import type { CSSProperties } from 'react';

import 'react-lazy-load-image-component/src/effects/opacity.css';
import './AlbumCard.css';

import type { AlbumCover, AlbumCoverSizes } from 'utils/types/album';

interface AlbumCardProps {
  artist?: string;
  background: AlbumCover;
  sizes?: AlbumCoverSizes;
  className?: string;
  interactive?: boolean;
  name?: string;
  year?: string | number;
}

export default function AlbumCard({
  background,
  sizes,
  name,
  artist,
  className = '',
  year,
  interactive = false,
}: AlbumCardProps) {
  const albumCardStyle: CSSProperties = {};
  let srcset = '';

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
        <>
          <small className="albumCard-year badge badge-secondary">{year}</small>
          <br />
        </>
      )}
      <strong className="albumCard-title">{name}</strong>
      <br />
      <span className="albumCard-artist">{artist}</span>
    </div>
  );

  const albumArt = background?.sm && (
    <LazyLoadImage className="albumArt" src={background.sm} srcSet={srcset} alt={name} effect="opacity" />
  );

  return (
    <div
      className={`albumCard ${className} ${interactive && 'interactive'}`}
      data-cy="AlbumCard"
      style={albumCardStyle}
    >
      {albumArt}
      {albumCaption}
    </div>
  );
}
