/**
 * Dither: Halftone
 */
import Jimp from "jimp";
import { isNodePattern } from "../helpers.js";
Jimp.prototype.ditherHalftone = function ditherHalftone(cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  for (let y = 0; y <= height - 2; y += 3) {
    for (let x = 0; x <= width - 2; x += 3) {
      let sum_r = 0, sum_g = 0, sum_b = 0;
      const indexed = [];
      let count = 0;
      for (let s_y = 0; s_y < 3; s_y++) {
        for (let s_x = 0; s_x < 3; s_x++) {
          const i = 4 * (width * (y + s_y) + (x + s_x));
          sum_r += data[i];
          sum_g += data[i + 1];
          sum_b += data[i + 2];
          data[i] = data[i + 1] = data[i + 2] = 0xff;
          indexed.push(i);
          count++;
        }
      }
      const avg_r = (sum_r / 9) > 127 ? 0xff : 0;
      const avg_g = (sum_g / 9) > 127 ? 0xff : 0;
      const avg_b = (sum_b / 9) > 127 ? 0xff : 0;
      const avg_lum = (avg_r + avg_g + avg_b) / 3;
      const scaled = Math.round((avg_lum * 9) / 255);
      if (scaled < 9) {
        data[indexed[4]] = avg_r;
        data[indexed[4] + 1] = avg_g;
        data[indexed[4] + 2] = avg_b;
      }
      if (scaled < 8) {
        data[indexed[5]] = avg_r;
        data[indexed[5] + 1] = avg_g;
        data[indexed[5] + 2] = avg_b;
      }
      if (scaled < 7) {
        data[indexed[1]] = avg_r;
        data[indexed[1] + 1] = avg_g;
        data[indexed[1] + 2] = avg_b;
      }
      if (scaled < 6) {
        data[indexed[6]] = avg_r;
        data[indexed[6] + 1] = avg_g;
        data[indexed[6] + 2] = avg_b;
      }
      if (scaled < 5) {
        data[indexed[3]] = avg_r;
        data[indexed[3] + 1] = avg_g;
        data[indexed[3] + 2] = avg_b;
      }
      if (scaled < 4) {
        data[indexed[8]] = avg_r;
        data[indexed[8] + 1] = avg_g;
        data[indexed[8] + 2] = avg_b;
      }
      if (scaled < 3) {
        data[indexed[2]] = avg_r;
        data[indexed[2] + 1] = avg_g;
        data[indexed[2] + 2] = avg_b;
      }
      if (scaled < 2) {
        data[indexed[0]] = avg_r;
        data[indexed[0] + 1] = avg_g;
        data[indexed[0] + 2] = avg_b;
      }
      if (scaled < 1) {
        data[indexed[7]] = avg_r;
        data[indexed[7] + 1] = avg_g;
        data[indexed[7] + 2] = avg_b;
      }
    }
  }

  this.bitmap.data = new Buffer(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

