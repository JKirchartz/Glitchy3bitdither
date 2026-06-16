/**
 * Gleech.js
 * Copyright (C) 2025 jkirchartz <me@jkirchartz.com>
 *
 * Extend JIMP with glitches
 *
 * Distributed under terms of the GPL 3.0 (General Public License) license.
 */

"use strict";

import Debug from 'debug';
const debug = Debug('gleech');

import { resolve } from 'path';
import importDir from '@yimura/import-dir';

// Import all glitch effects
const glitches = importDir(resolve('./glitches/'));

// Export helpers for advanced users
import "./helpers.js";

console.log('glitches', glitches);

// Glitch function categories for UI selection
export const glitchCategories = {
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

export const gleech = (function(gleech) {
  let imageData, originalImageData;
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

// For backwards compatibility with JIMP
import { Jimp } from "jimp";
export default Jimp;
