const isDevelopment = process.env.NODE_ENV === 'development';
const lib = await (isDevelopment ? import('./tweaks.dev') : import('./tweaks.prod'));

if (isDevelopment) {
  lib.init();
}

export const tweak = lib.tweak;
