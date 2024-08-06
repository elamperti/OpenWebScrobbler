import { Avatar } from 'utils/types/avatar';

const sizeMap = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extralarge: 'xl',
};

export function avatarTransformer(avatars: any[]): Avatar {
  if (!avatars || avatars.length === 0) return null;

  return avatars.reduce((acc, image) => {
    const targetSize = sizeMap[image.size];

    if (!targetSize) return acc;

    acc[targetSize] = image['#text'];
    return acc;
  }, {});
}
