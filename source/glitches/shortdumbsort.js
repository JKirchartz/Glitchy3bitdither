/**
 * shortdumbsort
 * @param {integer} start - pixel to start at
 * @param {integer} end - pixel to end at
 */
import { Jimp } from "jimp";
import { nullOrUndefined, randRange, randMinMax, randMinMax2, isNodePattern, debug } from "../helpers.js";
Jimp.prototype.shortdumbsort = function shortdumbsort(start, end, cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = new Uint32Array(this.bitmap.data.buffer);
  let mm;
  if (nullOrUndefined(start) && nullOrUndefined(end)) {
    mm = randMinMax(0, width * height);
    mm = randMinMax2(mm[0], mm[1]);
  } else if(!nullOrUndefined(start) && nullOrUndefined(end)) {
    mm = randMinMax(start, randRange(start, width * height));
  } else if(nullOrUndefined(start) && !nullOrUndefined(end)) {
    mm = randMinMax(randRange(0, (width * height) - end), end);
  } else {
    mm = [start, end];
  }
  try {
    const da = data.subarray(mm[0], mm[1] % data.length);
    debug("subarray length:", da.length, "start", mm[0], "end", mm[1]);
    Array.prototype.sort.call(da);
    debug("data length:", data.length, "offset", mm[0], "size", mm[0] + da.length);
    data.set(da, mm[0]);
    this.bitmap.data = Buffer.from(data);
  } catch (err) {
    console.error(err);
  }
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};
