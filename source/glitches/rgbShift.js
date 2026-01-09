/**
 * RGB Shift
 * @param {string} from - channel to shift color value from, 'r', 'g', or 'b'
 * @param {string} to - channel to shift color value to, 'r', 'g', or 'b'
 * @param {number} factor - factor by which to reduce other channels and boost the channel set by to
 */
import Jimp from "jimp";
import { throwError,nullOrUndefined,randFloor,randRange,isNodePattern } from "../helpers.js";
Jimp.prototype.rgbShift = function rgbShift(from, to, factor, cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  factor = !nullOrUndefined(factor) ? factor : randFloor(64);
  switch (from) {
  case "red":
  case "r":
    from = 0;
    break;
  case "green":
  case "g":
    from = 1;
    break;
  case "blue":
  case "b":
    from = 2;
    break;
  default:
    from = randRange(0,2);
  }
  switch (to) {
  case "red":
  case "r":
    to = 0;
    break;
  case "green":
  case "g":
    to = 1;
    break;
  case "blue":
  case "b":
    to = 2;
    break;
  default:
    to = randRange(0,2);
  }
  if (!nullOrUndefined(from) && typeof from !== "number") {
    if ("string" !== typeof from) {
      return throwError.call(this, "from must be a string", cb);
    }
    if (from !== "r" || from !== "g" || from !== "b" || from !== "red" || from !== "green" || from !== "blue") {
      return throwError.call(this, "from must be a string: 'red', 'green', 'blue', 'r', 'g', or 'b'", cb);
    }
  }
  if (!nullOrUndefined(to) && typeof from !== "number") {
    if ("string" !== typeof to) {
      return throwError.call(this, "to must be a string", cb);
    }
    if (to !== "r" || to !== "g" || to !== "b" || to !== "red" || to !== "green" || to !== "blue") {
      return throwError.call(this, "to must be a string: 'red', 'green', 'blue', 'r', 'g', or 'b'", cb);
    }
  }
  if (!nullOrUndefined(factor) && typeof from !== "number") {
    if ("number" !== typeof factor) {
      return throwError.call(this, "factor must be a number", cb);
    }
    if (factor < 2) {
      return throwError.call(this, "factor must be greater than 1", cb);
    }
  }
  for (let i = 0, size = width * height * 4; i < size; i += 4) {
    const shift = data[i + from] + factor;
    switch (to) {
    case 0:
      data[i + 1] -= factor;
      data[i + 2] -= factor;
      break;
    case 1:
      data[i + 0] -= factor;
      data[i + 2] -= factor;
      break;
    case 2:
      data[i + 1] -= factor;
      data[i + 3] -= factor;
      break;
    }
    data[i + to] = (shift) > 255 ? 255 : shift;
  }
  // your code here
  this.bitmap.data = new Buffer(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

