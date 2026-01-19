/**
 * shortsort
 * @param {integer} start - pixel to start at
 * @param {integer} end - pixel to end at
 */
import { Jimp } from "jimp";
import { nullOrUndefined,coinToss,randMinMax,randMinMax2,leftSort,rightSort,isNodePattern } from "../helpers.js";
Jimp.prototype.shortsort = function shortsort(dir, start, end, cb) {
  let width = this.bitmap.width,
    height = this.bitmap.height,
    data = new Uint32Array(this.bitmap.data),
    cut, mm;
  if (nullOrUndefined(start) && nullOrUndefined(end)) {
    mm = randMinMax(0, width * height);
    mm = randMinMax2(mm[0], mm[1]);
  } else if(!nullOrUndefined(start) && nullOrUndefined(end)) {
    mm = randMinMax(start, randMinMax2(width * height)[1]);
  } else if(nullOrUndefined(start) && !nullOrUndefined(end)) {
    mm = randMinMax(randMinMax2((width * height) - end)[0], end);
  } else {
    mm = [start, end];
  }
  cut = data.subarray(mm[0], mm[1]);
  dir = nullOrUndefined(dir)? coinToss() : dir;
  if (dir) {
    Array.prototype.sort.call(cut, leftSort);
  } else {
    Array.prototype.sort.call(cut, rightSort);
  }

  this.bitmap.data = Buffer.from(data.buffer);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};
