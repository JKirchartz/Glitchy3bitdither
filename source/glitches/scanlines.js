/**
 * scanlines
 * @param {number} type - 0 for xor, 1 for or, or 2 for invert
 * @param {number} size - size between scanlines, numbers between 3 and 15 look nice
 * @param {number} option - 0, 1, 2, or 3, to determine which value to use with Or or Xor
 */
import Jimp from "jimp";
import { nullOrUndefined,randRange,randChoice,isNodePattern } from "../helpers.js";
Jimp.prototype.scanlines = function scanlines(type, size, option, cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = new Uint32Array(this.bitmap.data),
    xorOptions = [0x00555555, 0x00FF00FF00, 0x00F0F0F0, 0x00333333],
    orOptions = [0xFF555555, 0xFFFF00FF00, 0xFFF0F0F0, 0xFF333333];

  type = nullOrUndefined(type) ? randRange(0, 3) : type % 3;
  size = nullOrUndefined(size) ? randRange(3, 15) : size;
  const xorNum = nullOrUndefined(option) ? randChoice(xorOptions) : xorOptions[option];
  const orNum = nullOrUndefined(option) ? randChoice(orOptions) : orOptions[option];
  for (let i = 0, l = data.length; i < l; i += (width * size)) {
    const row = Array.apply([], data.subarray(i, i + width));
    for (const p in row) {
      if (type === 0) {
        row[p] = row[p] ^ xorNum;
      } else if (type === 1) {
        row[p] = row[p] | orNum;
      } else {
        // invert
        row[p] = ~ row[p] | 0xFF000000;
      }
    }
    data.set(row, i);
  }

  this.bitmap.data = new Buffer(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};
