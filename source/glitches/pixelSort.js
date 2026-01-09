/**
 * pixelSort
 */
import Jimp from "jimp";
import { leftSort,isNodePattern } from "../helpers.js";
Jimp.prototype.pixelSort = function pixelSort(cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = new Uint32Array(this.bitmap.data);

  const upper = 0xFFAAAAAA, lower = 0xFF333333;
  for (let i = 0, size = data.length; i < size; i += width) {
    const row = Array.apply([], data.subarray(i, i + width));
    let low = 0, high = 0;
    for (const j in row) {
      if (!high && !low && row[j] >= low) {
        low = j;
      }
      if (low && !high && row[j] >= high) {
        high = j;
      }
    }
    if (low) {
      const da = row.slice(low, high);
      Array.prototype.sort.call(da, leftSort);
      data.set(da, (i + low) % (height * width));
    }
  }

  this.bitmap.data = new Buffer(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};
