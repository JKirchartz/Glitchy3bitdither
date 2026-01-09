/**
 * randomGlitch - randomly choose glitch functions to perform on the incoming image
 */
import Jimp from "jimp";
import { randFloor, randRange, isNodePattern, debug } from "../helpers.js";
Jimp.prototype.randomGlitch = function (cb) {
  const history = [];
  // enumerate glitch functions
  const glitches = [];
  for (const prop in Jimp.prototype) {
    if (typeof Jimp.prototype[prop] === "function" &&
				Jimp.prototype[prop].name){
      glitches.push(this[prop].name);
    }
  }
  for (let i = 0, l = randRange(3, 6); i < l; i++) {
    const fun = randFloor(glitches.length);
    this[glitches[fun]]();
    history.push(glitches[fun]);
  }
  if (history.length === 0) {
    return this.randomGlitch();
  }
  debug("randomGlitch history:", history);

  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};
