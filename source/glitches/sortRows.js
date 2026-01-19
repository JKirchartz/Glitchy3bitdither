/**
 * sortRows
 */
import { Jimp } from "jimp";
import { leftSort,isNodePattern } from "../helpers.js";
Jimp.prototype.sortRows = function sortRows(cb) {
  const width = this.bitmap.width,
    data = new Uint32Array(this.bitmap.data);

  for (let i = 0, size = data.length + 1; i < size; i += width) {
    const da = data.subarray(i, i + width);
    Array.prototype.sort.call(da, leftSort);
    da.copyWithin(data, i);
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

