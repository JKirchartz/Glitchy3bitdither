/**
 * Super Shift
 * @param {number} iter - number of times to shift color values
 * @param {boolean} dir - direction to shift colors, true for RGB->GBR, false for RGB->BRG.
 */
import { Jimp } from "jimp";
import { throwError,nullOrUndefined,randRange,coinToss,isNodePattern } from "../helpers.js";
Jimp.prototype.superShift = function superShift(iter, dir, cb) {
  if (!nullOrUndefined(iter)) {
    if ("number" !== typeof iter)
      return throwError.call(this, "iter must be a number", cb);
    if (iter < 2)
      return throwError.call(this, "iter must be greater than 1", cb);
  }
  if (!nullOrUndefined(dir))
    return throwError.call(this, "dir must be truthy or falsey", cb);
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  dir = !nullOrUndefined(dir) ? dir : coinToss();
  iter = !nullOrUndefined(iter) ? iter : randRange(1, 10);
  for (let i = 0, l = iter; i < l; i++) {
    for (let j = 0, size = width * height * 4; j < size; j += 4) {
      const r = data[j],
        g = data[j + 1],
        b = data[j + 2];
      data[j] = dir ? g : b;
      data[j + 1] = dir ? b : r;
      data[j + 2] = dir ? r : g;
    }
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

