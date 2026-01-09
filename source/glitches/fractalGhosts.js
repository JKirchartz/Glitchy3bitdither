/**
 * Fractal Ghosts
 * @param {number} type - A number from 0-3 determining which algorithm to use
 * @param {number} color - The color channel to use to create the ghosts
 */
import Jimp from "jimp";
import { throwError,nullOrUndefined,randRange,isNodePattern } from "../helpers.js";
Jimp.prototype.fractalGhosts = function fractalGhosts(type, color, cb) {
  if(!nullOrUndefined(type)) {
    if (typeof type !== "number")
      return throwError.call(this, "type must be a number", cb);
    if (type < 0 || type > 3)
      return throwError.call(this, "type must be a between 0 and 3", cb);
  }
  if(!nullOrUndefined(color)) {
    if (typeof color !== "number")
      return throwError.call(this, "color must be a number", cb);
    if (color < 0 || color > 4)
      return throwError.call(this, "color must be a between 0 and 4", cb);
  }
  let width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data,
    rand = randRange(1, 10),
    tmp = null;
  type = !nullOrUndefined(type) ? type : randRange(0,3);
  color = !nullOrUndefined(color) ? color : randRange(0,4);
  switch (type) {
  case 0:
    for (var i = 0; i < data.length; i++) {
      if (parseInt(data[i * 2 % data.length], 10) < parseInt(data[i], 10)) {
        data[i] = data[i * 2 % data.length];
      }
    }
    break;
  case 1:
    for (var i = 0; i < data.length; i++) {
      tmp = (i * rand) % data.length;
      if (parseInt(data[tmp], 10) < parseInt(data[i], 10)) {
        data[i] = data[tmp];
      }
    }
    break;
  case 2:
    for (var i = 0; i < data.length; i++) {
      if ((i % 4) === color) {
        data[i] = 0xFF;
        continue;
      }
      tmp = (i * rand) % data.length;
      if (parseInt(data[tmp], 10) < parseInt(data[i], 10)) {
        data[i] = data[tmp];
      }
    }
    break;
  case 3:
    for (var i = 0; i < data.length; i++) {
      if ((i % 4) === color) {
        data[i] = 0xFF;
        continue;
      }
      if (parseInt(data[i * 2 % data.length], 10) < parseInt(data[i], 10)) {
        data[i] = data[i * 2 % data.length];
      }
    }
    break;
  }
  this.bitmap.data = new Buffer(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

