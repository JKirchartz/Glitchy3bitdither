/**
 * Super Pixel Funk
 * @param {number} pixelation - size of pixels to use for pixelization
 */
import { Jimp } from "jimp";
import { throwError,nullOrUndefined,randRange,coinToss,randChoice,isNodePattern } from "../helpers.js";
Jimp.prototype.superPixelFunk = function superPixelFunk(pixelation, cb) {
  if (!nullOrUndefined(pixelation)) {
    if ("number" !== typeof pixelation)
      return throwError.call(this, "pixelation must be a number", cb);
    if (pixelation < 2)
      return throwError.call(this, "pixelation must be greater than 1", cb);
  }
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = new Uint32Array(this.bitmap.data.buffer);
  pixelation = !nullOrUndefined(pixelation) ? pixelation : randRange(2, 15);
  for (let y = 0; y < height; y += pixelation) {
    for (let x = 0; x < width; x += pixelation) {
      if (coinToss()) {
        const locale = coinToss();
        const mask = randChoice([0x00FF0000, 0x0000FF00, 0x000000FF]);
        const i = coinToss() ? (y * width + x) :
          (y * width + (x - (pixelation * 2)));
        for (let n = 0; n < pixelation; n++) {
          for (let m = 0; m < pixelation; m++) {
            if (x + m < width) {
              const j = ((width * (y + n)) + (x + m));
              data[j] = locale ? data[i] : data[j] | mask;
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

