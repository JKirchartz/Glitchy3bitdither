
/**
 * Green Shift
 * @param {number} factor - factor by which to reduce red and blue channels and boost green channel
 */
import Jimp from "jimp";
import { throwError,nullOrUndefined,randFloor,isNodePattern } from "../helpers.js";
Jimp.prototype.greenShift = function greenShift(factor, cb) {
  if (!nullOrUndefined(factor)) {
    if ("number" !== typeof factor)
      return throwError.call(this, "factor must be a number", cb);
    if (factor < 2)
      return throwError.call(this, "factor must be greater than 1", cb);
  }
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  factor = !nullOrUndefined(factor) ? factor : randFloor(64);
  for (let i = 0, size = width * height * 4; i < size; i += 4) {
    const shift = data[i + 1] + factor;
    data[i] -= factor;
    data[i + 1] = (shift) > 255 ? 255 : shift;
    data[i + 2] -= factor;
  }
  this.bitmap.data = new Buffer(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

