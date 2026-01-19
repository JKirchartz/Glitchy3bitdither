/**
 * Dither: 8 bits
 * @param {number} size - a number greater than 1 representing pixel size.
 */
import { Jimp } from "jimp";
import { throwError,nullOrUndefined,randRange,isNodePattern } from "../helpers.js";
Jimp.prototype.dither8Bit = function dither8Bit(size, cb) {
  size = nullOrUndefined(size) ? randRange(4, 15) : size;
  if (typeof size !== "number") {
    return throwError.call(this, "size must be a number " + size, cb);
  }
  if (size < 2) {
    return throwError.call(this, "size must be greater than 1", cb);
  }

  let width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data,
    sum_r, sum_g, sum_b, avg_r, avg_g, avg_b;

  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      sum_r = 0;
      sum_g = 0;
      sum_b = 0;
      var s_y, s_x, i;
      for (s_y = 0; s_y < size; s_y++) {
        for (s_x = 0; s_x < size; s_x++) {
          i = 4 * (width * (y + s_y) + (x + s_x));
          sum_r += data[i];
          sum_g += data[i + 1];
          sum_b += data[i + 2];
        }
      }
      avg_r = (sum_r / (size * size)) > 127 ? 0xff : 0;
      avg_g = (sum_g / (size * size)) > 127 ? 0xff : 0;
      avg_b = (sum_b / (size * size)) > 127 ? 0xff : 0;
      for (s_y = 0; s_y < size; s_y++) {
        for (s_x = 0; s_x < size; s_x++) {
          i = 4 * (width * (y + s_y) + (x + s_x));
          data[i] = avg_r;
          data[i + 1] = avg_g;
          data[i + 2] = avg_b;
        }
      }
    }
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

