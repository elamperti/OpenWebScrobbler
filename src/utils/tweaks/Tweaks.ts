const isDevelopment = process.env.NODE_ENV === 'development' && !process.env.NO_DEVTOOLS;
const lib = await (isDevelopment ? import('./tweaks.dev') : import('./tweaks.prod'));

if (isDevelopment) {
  lib.init();
}

export const tweak = lib.tweak;
