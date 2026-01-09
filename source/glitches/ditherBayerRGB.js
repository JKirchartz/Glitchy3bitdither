/**
 * Dither: Bayer 3 - full-color bayer algo
 * @param {number} map - which matrix to use for the threshold map - 0: 3x3,  1: 4x4, 2: 8x8
 */
import Jimp from "jimp";
import { throwError,nullOrUndefined,randFloor,isNodePattern } from "../helpers.js";
Jimp.prototype.ditherBayer3 = function ditherBayer3(map, cb) {
  map = !nullOrUndefined(map) ? map : randFloor(3);
  if (typeof map !== "number")
    return throwError.call(this, "map must be a number", cb);
  if (map < 0 || map > 2)
    return throwError.call(this, "map must be a number from 0 to 2", cb);
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data,
    /* adding in more threshold maps, and the randomizer */
    threshold_maps = [
      [
        [3, 7, 4],
        [6, 1, 9],
        [2, 8, 5]
      ],
      [
        [1, 9, 3, 11],
        [13, 5, 15, 7],
        [4, 12, 2, 10],
        [16, 8, 14, 6]
      ],
      [
        [1, 49, 13, 61, 4, 52, 16, 64],
        [33, 17, 45, 29, 36, 20, 48, 32],
        [9, 57, 5, 53, 12, 60, 8, 56],
        [41, 25, 37, 21, 44, 28, 40, 24],
        [3, 51, 15, 63, 2, 50, 14, 62],
        [35, 19, 47, 31, 34, 18, 46, 30],
        [11, 59, 7, 55, 10, 58, 6, 54],
        [43, 27, 39, 23, 42, 26, 38, 22]
      ]
    ],
    threshold_map = !nullOrUndefined(map) ? threshold_maps[map] : threshold_maps[randFloor(threshold_maps.length)],
    size = threshold_map.length;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = 4 * (y * width + x);
      /* apply the tranformation to each color */
      data[i] = ((data[i] * 17) / 255) < threshold_map[x % size][y %
							size] ? 0 : 0xff;
      data[i + 1] = ((data[i + 1] * 17) / 255) < threshold_map[x %
							size][y % size] ? 0 : 0xff;
      data[i + 2] = ((data[i + 2] * 17) / 255) < threshold_map[x %
							size][y % size] ? 0 : 0xff;
    }
  }
  this.bitmap.data = new Buffer(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

