/**
 * randomSortRows
 */
import Jimp from "jimp";
import { coinToss,isNodePattern } from "../helpers.js";
Jimp.prototype.randomSortRows = function randomSortRows(cb) {
  const width = this.bitmap.width,
    data = new Uint32Array(this.bitmap.data);
  for (let i = 0, size = data.length; i < size; i += width) {
    const da = data.subarray(i, i + width);
    Array.prototype.sort.call(da, coinToss);
    data.set(da, i);
  }
  this.bitmap.data = new Buffer(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};
