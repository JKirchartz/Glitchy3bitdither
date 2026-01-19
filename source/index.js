/**
 * Gleech.js
 * Copyright (C) 2025 jkirchartz <me@jkirchartz.com>
 *
 * Extend JIMP with glitches
 *
 * Distributed under terms of the GPL 3.0 (General Public License) license.
 */

"use strict";

// Import all glitch effects
import "./glitches/pixelFunk.js";
import "./glitches/superPixelFunk.js";
import "./glitches/shortSort.js";
import "./glitches/shortdumbsort.js";
import "./glitches/sort.js";
import "./glitches/slicesort.js";
import "./glitches/sortStripe.js";
import "./glitches/sortRows.js";
import "./glitches/randomSortRows.js";
import "./glitches/dumbSortRows.js";
import "./glitches/pixelSort.js";
import "./glitches/randomGlitch.js";
import "./glitches/glitch.js";
import "./glitches/preset.js";
import "./glitches/focusImage.js";
import "./glitches/rgb_glitch.js";
import "./glitches/inverse.js";
import "./glitches/slice.js";
import "./glitches/scanlines.js";
import "./glitches/fractalGhosts.js";
import "./glitches/fractal.js";
import "./glitches/drumrollHorizontal.js";
import "./glitches/drumrollVertical.js";
import "./glitches/drumrollHorizontalWave.js";
import "./glitches/drumrollVerticalWave.js";
import "./glitches/ditherBitmask.js";
import "./glitches/colorShift.js";
import "./glitches/ditherRandom.js";
import "./glitches/ditherBayer.js";
import "./glitches/redShift.js";
import "./glitches/greenShift.js";
import "./glitches/blueShift.js";
import "./glitches/superShift.js";
import "./glitches/superSlice.js";
import "./glitches/ditherAtkinson.js";
import "./glitches/ditherFloydSteinberg.js";
import "./glitches/ditherHalftone.js";
import "./glitches/dither8bit.js";

// Export helpers for advanced users
export {
  throwError,
  adjustPixelError,
  nullOrUndefined,
  randFloor,
  randRound,
  randRange,
  coinToss,
  randMinMax,
  randMinMax2,
  randChoice,
  randChance,
  sum,
  leftSort,
  rightSort,
  blueSort,
  greenSort,
  redSort,
  hueSort,
  randSort,
  isNodePattern,
  debug
} from "./helpers.js";

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

// For backwards compatibility with JIMP
import { Jimp } from "jimp";
export default Jimp;
