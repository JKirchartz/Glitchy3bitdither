/**
 * slicesort
 * @param {boolean} direction - direction to sort, T/F for Left or Right
 * @param {integer} start - pixel to start at
 * @param {integer} end - pixel to end at
 */
import { Jimp } from "jimp";
import { nullOrUndefined,randRound,coinToss,randMinMax,randMinMax2,leftSort,rightSort,isNodePattern } from "../helpers.js";
Jimp.prototype.slicesort = function slicesort(dir, start, end, cb) {
  let width = this.bitmap.width,
    height = this.bitmap.height,
    mm,
    data = new Uint32Array(this.bitmap.data);
  dir = nullOrUndefined(dir)? coinToss() : dir;

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

  const cut = data.subarray(mm[0], mm[1]),
    offset = Math.abs(randRound(data.length) - cut.length) % data.length;
  if(dir) {
    Array.prototype.sort.call(cut, leftSort);
  } else {
    Array.prototype.sort.call(cut, rightSort);
  }
  data.set(data.buffer, coinToss() ? offset : mm[0]);

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};
