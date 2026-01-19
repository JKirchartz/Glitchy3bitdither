/**
 * Pixel Funk
 * @param {number} pixelation - size of pixels to use for pixelization
 */

import { Jimp } from "jimp";
import { nullOrUndefined, throwError, randRange, coinToss, isNodePattern } from "../helpers.js";

Jimp.prototype.pixelFunk = function pixelFunk(pixelation, cb) {
  if (!nullOrUndefined(pixelation)) {
    if ("number" !== typeof pixelation)
      return throwError.call(this, "pixelation must be a number", cb);
    if (pixelation < 2)
      return throwError.call(this, "pixelation must be greater than 1", cb);
  }
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = new Uint32Array(this.bitmap.data.buffer);
  pixelation = !nullOrUndefined(pixelation) ? pixelation : randRange(2, 10);
  for (let y = 0; y < height; y += pixelation) {
    for (let x = 0; x < width; x += pixelation) {
      if (coinToss()) {
        const i = (y * width + x);
        for (let n = 0; n < pixelation; n++) {
          for (let m = 0; m < pixelation; m++) {
            if (x + m < width) {
              const j = ((width * (y + n)) + (x + m));
              data[j] = data[i];
            }
          }
        }
      }
    }
  }
  this.bitmap.data.writeUInt32BE(data, 0);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

