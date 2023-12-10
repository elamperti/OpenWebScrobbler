import { LazyLoadImage } from 'react-lazy-load-image-component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAstronaut } from '@fortawesome/free-solid-svg-icons';

import type { SizeProp } from '@fortawesome/fontawesome-svg-core';

import type { AvatarSizes } from 'utils/types/avatar';

import './Avatar.css';

interface AvatarProps {
  alt: string;
  className?: string;
  isArtist?: boolean;
  size?: AvatarSizes;
  url: string | null;
}

// eslint-disable-next-line no-unused-vars
const iconSizes: { [key in AvatarSizes]: SizeProp } = {
  xl: '5x',
  lg: '5x',
  md: '3x',
  sm: '1x',
};

// eslint-disable-next-line no-unused-vars
const imgSizes: { [key in AvatarSizes]: number } = {
  xl: 300,
  lg: 128,
  md: 64,
  sm: 24,
};

export default function Avatar({ alt = '', className = '', isArtist = false, size = 'sm', url = null }: AvatarProps) {
  const iconSize = iconSizes[size];
  const baseClassName = `user-avatar user-avatar-${size} rounded-circle ${className}`;

  if (!url) {
    return (
      <div className={`${baseClassName} d-inline-flex justify-content-center align-items-center without-img`}>
        <FontAwesomeIcon icon={faUserAstronaut} size={iconSize} color="white" className="d-block me-0" />
      </div>
    );
  }

  const imgSize = isArtist ? null : imgSizes[size];

  return <LazyLoadImage src={url} alt={alt} className={baseClassName} width={imgSize} height={imgSize} />;
}
