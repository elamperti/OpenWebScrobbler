import { AvatarSizes } from 'components/Avatar';

const sizeMap = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extralarge: 'xl',
};

export function avatarTransformer(avatars: any[]): { [key in AvatarSizes]: string } {
  if (avatars.length === 0) return null;

  return avatars.reduce((acc, image) => {
    const targetSize = sizeMap[image.size];

    if (!targetSize) return acc;

    acc[targetSize] = image['#text'];
    return acc;
  }, {});
}
