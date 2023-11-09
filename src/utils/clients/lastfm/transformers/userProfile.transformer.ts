import get from 'lodash/get';

const sizeMap = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  extralarge: 'xl',
};

export function userProfileTransformer(response: any) {
  const userData = response?.data?.user || {};
  let avatar = null;

  if (userData.image) {
    avatar = (get(userData, 'image') as any[]).reduce((avatars, image) => {
      avatars[sizeMap[image.size]] = image['#text'];
      return avatars;
    }, {});
  }

  return {
    name: userData.name || '',
    url: userData.url || '',
    // country: userData.country || '',
    avatar,
  };
}
