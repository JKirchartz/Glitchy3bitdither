
/**
 * drumrollHorizontalWave
 */
import { Jimp } from "jimp";
import { isNodePattern } from "../helpers.js";
Jimp.prototype.drumrollHorizontalWave = function drumrollHorizontalWave(cb) {
  // borrowed from https://github.com/ninoseki/glitched-canvas & modified with cosine
  let width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data,
    roll = 0;
  for (let x = 0; x < width; x++) {
    if (Math.random() > 0.95) roll = Math.floor(Math.cos(x) * (height * 2));
    if (Math.random() > 0.98) roll = 0;

    for (let y = 0; y < height; y++) {
      const idx = (x + y * width) * 4;

      let x2 = x + roll;
      if (x2 > width - 1) x2 -= width;
      const idx2 = (x2 + y * width) * 4;

      for (let c = 0; c < 4; c++) {
        data[idx2 + c] = data[idx + c];
      }
    }
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};
