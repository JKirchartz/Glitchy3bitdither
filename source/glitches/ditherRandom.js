/**
 * Dither: Random - dither according to noise
 */
import Jimp from "jimp";
import { randRound,isNodePattern } from "../helpers.js";
Jimp.prototype.ditherRandom = function ditherRandom(cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  for (var i = 0, val, scaled, size = width * height * 4; i < size; i += 4) {
    scaled = ((data[i] + data[i + 1] + data[i + 2]) / 3) % 255;
    val = scaled < randRound(128) ? 0 : 0xff;
    data[i] = data[i + 1] = data[i + 2] = val;
  }
  this.bitmap.data = new Buffer(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;

};

