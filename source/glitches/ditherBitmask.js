/**
 * Dither: Bitmask
 * @param {number} mask - number with which to mask each color channel 1-254
 */
import Jimp from "jimp";
import { throwError,nullOrUndefined,randRange,isNodePattern } from "../helpers.js";
Jimp.prototype.ditherBitmask = function ditherBitmask(mask, cb) {
  if (!nullOrUndefined(mask)) {
    if ("number" !== typeof mask)
      return throwError.call(this, "mask must be a number", cb);
    if (mask < 0 || mask > 254)
      return throwError.call(this, "mask must be a number from 0 to 2", cb);
  }
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data,
    M = !nullOrUndefined(mask) ? mask : randRange(1, 125);
  // 0xc0; 2 bits
  // 0xe0  3 bits
  // 0xf0  4 bits
  for (let i = 0, size = width * height * 4; i < size; i += 4) {
    data[i] |= M;
    data[i + 1] |= M;
    data[i + 2] |= M;
  }

  this.bitmap.data = new Buffer(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

