import Debug from 'debug';
import { resolve } from 'path';
import importDir from '@yimura/import-dir';
import { Jimp } from 'jimp';
export { Jimp as default } from 'jimp';

/**
 * Gleech.js
 * Copyright (C) 2025 jkirchartz <me@jkirchartz.com>
 *
 * Extend JIMP with glitches
 *
 * Distributed under terms of the GPL 3.0 (General Public License) license.
 */

Debug('gleech');

// Import all glitch effects
const glitches = importDir(resolve('./glitches/'));

console.log('glitches', glitches);

// Glitch function categories for UI selection
const glitchCategories = {
  exp: [
    'pixelFunk', 'superPixelFunk', 'shortsort', 'shortdumbsort',
    'sort', 'slicesort', 'sortStripe', 'sortRows', 'randomSortRows', 'dumbSortRows',
    'pixelSort', 'randomGlitch', 'glitch', 'preset1', 'preset2', 'preset3', 'preset4'
  ],
  orig: [
    'focusImage', 'rgb_glitch', 'invert', 'slice', 'scanlines',
    'fractalGhosts', 'fractal',
    'drumrollHorizontal', 'drumrollVertical', 'drumrollHorizontalWave',
    'drumrollVerticalWave', 'ditherBitmask', 'colorShift',
    'ditherRandom', 'ditherRandom3', 'ditherBayer', 'ditherBayer3', 'redShift',
    'greenShift', 'blueShift', 'superShift', 'superSlice',
    'ditherAtkinsons', 'ditherFloydSteinberg', 'ditherHalftone', 'dither8bit'
  ]
};

const gleech = (function(gleech) {
  gleech.init = function init(data) {
    if ( data.toString() !== "[object ImageData]" ) {
      throw new Error('Gleech expects ImageData');
    } else {
      gleech.imageData = data;
      gleech.originalImageData = data;
    }
    return this;
  };
  gleech.original = function original(imageData) { return imageData ?? gleech.originalImageData; };

});

export { gleech, glitchCategories };
//# sourceMappingURL=gleech.mjs.map
