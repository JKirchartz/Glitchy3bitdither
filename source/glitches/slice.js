/**
 * Slice
 * @param {number} cutstart - datapoint to begin cut
 * @param {number} cutend - datapoint to finalize cut
 */
import { Jimp } from "jimp";
import { throwError, nullOrUndefined, randFloor, isNodePattern, debug } from "../helpers.js";
Jimp.prototype.slice = function slice(cutstart, cutend, cb) {
  if (!nullOrUndefined(cutstart)) {
    if ("number" !== typeof cutstart)
      return throwError.call(this, "cutstart must be a number", cb);
    if (cutstart > 0 && cutstart < cutend)
      return throwError.call(this, "cutstart must be greater than 0 and less than cutend", cb);
  }
  if (!nullOrUndefined(cutend)) {
    if ("number" !== typeof cutend)
      return throwError.call(this, "cutend must be a number", cb);
    if (cutend > 0 && cutend > cutstart)
      return throwError.call(this, "cutend must be greater than 0 and greater than cutstart", cb);
  }
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  cutend = !nullOrUndefined(cutend) ? cutend : randFloor(width * height * 4);
  cutstart = !nullOrUndefined(cutstart) ? cutstart : Math.floor(cutend / 1.7);
  const cut = data.subarray(cutstart, cutend);
  debug("slice::\ncut: %s, start: %s, end: %s", cut.length, cutstart, cutend);
  data.set(cut, randFloor((width * height * 4) - cut.length) || 0);
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};
