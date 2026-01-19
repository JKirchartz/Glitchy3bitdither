/**
 * Select Slice
 * @param {number} selection - Algorithm to use to make an automatic slice (currently 0 or 1)
 */
import { Jimp } from "jimp";
import { throwError,nullOrUndefined,randFloor,randRange,isNodePattern } from "../helpers.js";
Jimp.prototype.selectSlice = function selectSlice(selection, cb) {
  if (!nullOrUndefined(selection)) {
    if ("number" !== typeof selection)
      return throwError.call(this, "selection must be a number", cb);
    if (selection < 0 && selection > 1)
      return throwError.call(this, "selection must be 0 or 1", cb);
  }
  let width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data,
    cutend, cutstart;
  selection = !nullOrUndefined(selection) ? selection : randRange(0,1);

  switch (selection) {
  case 0:
    cutend = randFloor(width * height * 4);
    cutstart = Math.floor(cutend / 1.7);
    break;
  case 1:
    cutend = Math.random() < 0.75 ? randFloor(width * height * 4) : (width * height * 4);
    cutstart = Math.floor(cutend / 1.7);
    break;
  }
  const cut = data.subarray(cutstart, cutend);
  data.set(cut, randFloor((width * height * 4) - cut.length));
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

