/**
 * colorShift2
 * @param {boolean} dir - direction to shift pixels (left or right)
 */
import Jimp from "jimp";
import { throwError,nullOrUndefined,coinToss,isNodePattern } from "../helpers.js";
Jimp.prototype.colorShift2 = function colorShift2(dir, cb) {
  if (!nullOrUndefined(dir))
    return throwError.call(this, "dir must be truthy or falsey", cb);
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  dir = !nullOrUndefined(dir) ? dir : coinToss();
  for (let i = 0, size = data.length; i < size; i++) {
    let a = data[i] >> 24 & 0xFF,
      r = data[i] >> 16 & 0xFF,
      g = data[i] >> 8 & 0xFF,
      b = data[i] & 0xFF;
    r = (dir ? g : b) & 0xFF;
    g = (dir ? b : r) & 0xFF;
    b = (dir ? r : g) & 0xFF;
    data[i] = (a << 24) + (r << 16) + (g << 8) + (b);
  }
  this.bitmap.data = new Buffer(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

