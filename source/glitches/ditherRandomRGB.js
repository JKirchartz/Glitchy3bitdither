/**
 * Dither: Random 3 - full color dithering via noise
 */
import { Jimp } from "jimp";
import { randRound,isNodePattern } from "../helpers.js";
Jimp.prototype.ditherRandom3 = function ditherRandom3(cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  for (let i = 0, size = width * height * 4; i < size; i += 4) {
    data[i] = data[i] < randRound(128) ? 0 : 0xff;
    data[i + 1] = data[i + 1] < randRound(128) ? 0 : 0xff;
    data[i + 2] = data[i + 2] < randRound(128) ? 0 : 0xff;
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

