/**
 * rgb_glitch
 * @param {number} offset - pixels to offset
 * @param {number} rgb - number representing R (0), G (1), or B (2)
 * @param {boolean} direction - shift pixels left or right, truthy for left, falsey for right
 */
import { Jimp } from "jimp";
import { nullOrUndefined,randRange,coinToss,isNodePattern } from "../helpers.js";
Jimp.prototype.rgb_glitch = function rgb_glitch(offset, rgb, dir, cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  offset = nullOrUndefined(offset) ? randRange(10, width - 10) : offset % width;
  rgb = !nullOrUndefined(rgb) ? rgb % 3 : offset % 3;
  dir = nullOrUndefined(dir) ? coinToss() : !!dir;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = ((width * y) + x) * 4,
        red = data[index],
        green = data[index + 1],
        blue = data[index + 2];
      if (dir) {
        if (rgb === 0) {
          data[index + offset] = red;
          data[index + offset + 1] = green;
          data[index] = blue;
        }else if (rgb === 1) {
          data[index] = red;
          data[index + offset + 1] = green;
          data[index + offset] = blue;
        } else {
          data[index + offset] = red;
          data[index + 1] = green;
          data[index + offset] = blue;
        }
      } else {
        if (rgb === 0) {
          data[index - offset + 1] = red;
          data[index - offset] = green;
          data[index] = blue;
        }else if (rgb === 1) {
          data[index + 1] = red;
          data[index - offset] = green;
          data[index - offset] = blue;
        } else {
          data[index - offset + 1] = red;
          data[index] = green;
          data[index - offset] = blue;
        }
      }
    }
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};
