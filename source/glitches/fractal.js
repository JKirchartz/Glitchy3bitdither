/**
 * Fractal
 * @param {number} type - A number from (currently 0 or 1) determining which algorithm to use
 */
import Jimp from "jimp";
import { throwError,nullOrUndefined,randRange,isNodePattern } from "../helpers.js";
Jimp.prototype.fractal = function fractal(type, cb) {
  if(!nullOrUndefined(type)) {
    if (typeof type !== "number")
      return throwError.call(this, "type must be a number", cb);
    if (type < 0 || type > 1)
      return throwError.call(this, "type must be a 0 or 1", cb);
  }
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  type = !nullOrUndefined(type) ? type : randRange(0,1);
  switch (type) {
  case 0:
    for (let i = data.length; i; i--) {
      if (parseInt(data[(i * 2) % data.length], 10) < parseInt(data[i], 10)) {
        data[i] = data[(i * 2) % data.length];
      }
    }
    break;
  case 1:
    var m = randRange(2, 8);
    for (let j = 0; j < data.length; j++) {
      if (parseInt(data[(j * m) % data.length], 10) < parseInt(data[j], 10)) {
        data[j] = data[(j * m) % data.length];
      }
    }
    break;
  }
  this.bitmap.data = new Buffer(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

