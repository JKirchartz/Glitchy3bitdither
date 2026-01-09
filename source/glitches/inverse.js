/**
 * inverse
 */
import Jimp from "jimp";
import { isNodePattern } from "../helpers.js";
Jimp.prototype.inverse = function inverse(cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = new Uint32Array(this.bitmap.data);
  for (let i = 0; i < data.length; i++) {
    data[i] = ~ data[i] | 0xFF000000;
  }
  this.bitmap.data = new Buffer(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

