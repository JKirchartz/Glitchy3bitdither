/**
 * sort
 * @param {boolean} direction - T/F for Left or Right
 */
import { Jimp } from "jimp";
import { nullOrUndefined,coinToss,leftSort,rightSort,isNodePattern } from "../helpers.js";
Jimp.prototype.sort = function sort(dir, cb) {
  const data = new Uint32Array(this.bitmap.data);
  dir = nullOrUndefined(dir)? coinToss() : dir;

  if (dir) {
    Array.prototype.sort.call(data, leftSort);
  } else {
    Array.prototype.sort.call(data, rightSort);
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};
