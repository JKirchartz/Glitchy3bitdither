/**
 * Preset - sequentially run ___ with random parameters
 * number - which preset to run (1-4) (default to 5 random glitches)
 */
import Jimp from "jimp";
import { isNodePattern, debug } from "../helpers.js";
Jimp.prototype.preset = function (number, cb) {
  let ops = [];
  switch(number) {
  case 1:
    ops = ["ditherRandom3", "shortsort", "slice", "invert", "shortsort", "shortsort", "ditherRandom3", "drumrollVerticalWave", "ditherBayer3", "dumbSortRows", "slicesort", "drumrollVertical"];
    break;
  case 2:
    ops = ["shortsort", "slice", "fractalGhosts", "sort", "fractalGhosts", "colorShift"];
    break;
  case 3:
    ops = ["ditherRandom3", "focusImage", "scanlines"];
    break;
  case 4:
    ops = ["ditherAtkinsons", "focusImage", "ditherRandom3", "focusImage"];
    break;
  default:
    ops = ["glitch"];
    break;
  }
  for (const i in ops) {
    debug(ops[i]);
    this[ops[i]]();
  }
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};


