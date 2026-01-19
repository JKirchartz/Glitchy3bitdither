/**
 * Glitch - randomly choose glitch functions to perform on the incoming image
 */
import { Jimp } from "jimp";
import { randFloor, randRange, coinToss, isNodePattern, debug } from "../helpers.js";
Jimp.prototype.glitch = function (cb) {
  // chose and run random functions
  const hist = [];
  for (let i = 0, l = randRange(5, 10); i < l; i++) {
    switch (randFloor(13)) {
    case 0:
      this.focusImage();
      hist.push("focusImage");
      break;
    case 1:
      this.ditherBitmask();
      hist.push("ditherBitmask");
      break;
    case 2:
      this.superSlice();
      hist.push("superSlice");
      break;
    case 3:
      this.colorShift();
      hist.push("colorShift");
      break;
    case 4:
      this.ditherRandom3();
      hist.push("ditherRandom3");
      break;
    case 5:
      this.ditherBayer3();
      hist.push("ditherBayer3");
      break;
    case 6:
      this.ditherAtkinsons();
      hist.push("ditherAtkinsons");
      break;
    case 7:
      this.ditherFloydSteinberg();
      hist.push("ditherFloydSteinberg");
      break;
    case 8:
      this.ditherHalftone();
      hist.push("ditherHalftone");
      break;
    case 9:
      this.dither8Bit();
      hist.push("dither8bit");
      break;
    case 10:
      if (coinToss()) {
        const picker = randFloor(3);
        if (picker == 1) {
          this.redShift();
          hist.push("redShift");
        } else if (picker == 2) {
          this.greenShift();
          hist.push("greenShift");
        } else {
          this.blueShift();
          hist.push("blueShift");
        }
      }
      break;
    default:
      this.inverse();
      hist.push("invert");
      break;
    }
  }
  debug("glitch history: ", hist.join(", "));
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};
