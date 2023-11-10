import { AvatarSizes } from 'utils/types/avatar';

const sizeMap = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extralarge: 'xl',
};

// eslint-disable-next-line no-unused-vars
export function avatarTransformer(avatars: any[]): { [key in AvatarSizes]: string } {
  if (avatars.length === 0) return null;

  return avatars.reduce((acc, image) => {
    const targetSize = sizeMap[image.size];

    if (!targetSize) return acc;

    acc[targetSize] = image['#text'];
    return acc;
  }, {});
}
