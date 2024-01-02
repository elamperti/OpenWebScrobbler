import * as developmentLib from './tweaks.dev';
import * as productionLib from './tweaks.prod';

const isDevelopment = process.env.NODE_ENV === 'development' && !process.env.NO_DEVTOOLS;
const lib = isDevelopment ? developmentLib : productionLib;

if (isDevelopment) {
  lib.init();
}

export const tweak = lib.tweak;
