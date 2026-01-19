'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jimp = require('jimp');

/***************************************************
 * Helper Functions
 ***************************************************/


function debug(...args) {
}

function throwError(err, cb) {
  if (typeof err === "string") err = new Error(err);
  if (typeof cb === "function") return cb.call(this, err);
  else throw err;
}

function adjustPixelError(data, i, error, multiplier) {
  data[i] = data[i] + multiplier * error[0];
  data[i + 1] = data[i + 1] + multiplier * error[1];
  data[i + 2] = data[i + 2] + multiplier * error[2];
}

function nullOrUndefined(item) {
  if (typeof item === "undefined" || item === null) {
    return true;
  }
  return false;
}

// return random # < a
function randFloor(a) {return Math.floor(Math.random() * a);}
// return random # <= a
function randRound(a) {return Math.round(Math.random() * a);}
// return random # between A & B
function randRange(a, b) {return Math.round(Math.random() * b) + a;}
// relatively fair 50/50
function coinToss() {return Math.random() > 0.5;}
function randMinMax(min, max) {
  // generate min & max values by picking
  // one 'fairly', then picking another from the remainder
  const randA = Math.round(randRange(min, max));
  const randB = Math.round(randRange(randA, max));
  return [randA, randB];
}
function randMinMax2(min, max) {
  // generate min & max values by picking both fairly
  // then returning the lesser value before the greater.
  const randA = Math.round(randRange(min, max));
  const randB = Math.round(randRange(min, max));
  return randA < randB ? [randA, randB] : [randB, randA];
}
function randChoice(arr) {
  return arr[randFloor(arr.length)];
}

function randChance(percent) {
  // percent is a number 1-100
  return (Math.random() < (percent / 100));
}

function sum(o) {
  for (var s = 0, i = o.length; i; s += o[--i]) {}
  return s;
}
function leftSort(a, b) {return parseInt(a, 10) - parseInt(b, 10);}
function rightSort(a, b) {return parseInt(b, 10) - parseInt(a, 10);}
function blueSort(a, b) {
  const aa = a >> 24 & 0xFF;
  const bb = b & 0xFF;
  return aa - bb;
}
function redSort(a, b) {
  const ar = a >> 16 & 0xFF;
  const br = b >> 16 & 0xFF;
  return ar - br;
}
function greenSort(a, b) {
  const ag = a >> 8 & 0xFF;
  const bg = b >> 8 & 0xFF;
  return ag - bg;
}
function hueSort(a, b) {
  const aa = a >> 24 & 0xFF,
    ar = a >> 16 & 0xFF,
    ag = a >> 8 & 0xFF,
    ab = a & 0xFF;
  const ba = b >> 24 & 0xFF,
    br = b >> 16 & 0xFF,
    bg = b >> 8 & 0xFF,
    bb = b & 0xFF;
  return ((aa + ar + ag + ab) / 4) - ((ba + br + bg + bb) / 4);
}
function randSort(a, b) {
  const sort = randChoice([coinToss, leftSort, rightSort, redSort, greenSort,
    blueSort, hueSort]);
  return sort(a, b);
}


function isNodePattern(cb) {
  // borrowed from JIMP
  if ("undefined" === typeof cb) return false;
  if ("function" !== typeof cb)
    throw new Error("Callback must be a function");
  return true;
}

/**
 * Pixel Funk
 * @param {number} pixelation - size of pixels to use for pixelization
 */


jimp.Jimp.prototype.pixelFunk = function pixelFunk(pixelation, cb) {
  if (!nullOrUndefined(pixelation)) {
    if ("number" !== typeof pixelation)
      return throwError.call(this, "pixelation must be a number", cb);
    if (pixelation < 2)
      return throwError.call(this, "pixelation must be greater than 1", cb);
  }
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = new Uint32Array(this.bitmap.data.buffer);
  pixelation = !nullOrUndefined(pixelation) ? pixelation : randRange(2, 10);
  for (let y = 0; y < height; y += pixelation) {
    for (let x = 0; x < width; x += pixelation) {
      if (coinToss()) {
        const i = (y * width + x);
        for (let n = 0; n < pixelation; n++) {
          for (let m = 0; m < pixelation; m++) {
            if (x + m < width) {
              const j = ((width * (y + n)) + (x + m));
              data[j] = data[i];
            }
          }
        }
      }
    }
  }
  this.bitmap.data.writeUInt32BE(data, 0);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Super Pixel Funk
 * @param {number} pixelation - size of pixels to use for pixelization
 */
jimp.Jimp.prototype.superPixelFunk = function superPixelFunk(pixelation, cb) {
  if (!nullOrUndefined(pixelation)) {
    if ("number" !== typeof pixelation)
      return throwError.call(this, "pixelation must be a number", cb);
    if (pixelation < 2)
      return throwError.call(this, "pixelation must be greater than 1", cb);
  }
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = new Uint32Array(this.bitmap.data.buffer);
  pixelation = !nullOrUndefined(pixelation) ? pixelation : randRange(2, 15);
  for (let y = 0; y < height; y += pixelation) {
    for (let x = 0; x < width; x += pixelation) {
      if (coinToss()) {
        const locale = coinToss();
        const mask = randChoice([0x00FF0000, 0x0000FF00, 0x000000FF]);
        const i = coinToss() ? (y * width + x) :
          (y * width + (x - (pixelation * 2)));
        for (let n = 0; n < pixelation; n++) {
          for (let m = 0; m < pixelation; m++) {
            if (x + m < width) {
              const j = ((width * (y + n)) + (x + m));
              data[j] = locale ? data[i] : data[j] | mask;
            }
          }
        }
      }
    }
  }
  this.bitmap.data.writeUInt32BE(data, 0);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * shortsort
 * @param {integer} start - pixel to start at
 * @param {integer} end - pixel to end at
 */
jimp.Jimp.prototype.shortsort = function shortsort(dir, start, end, cb) {
  let width = this.bitmap.width,
    height = this.bitmap.height,
    data = new Uint32Array(this.bitmap.data),
    cut, mm;
  if (nullOrUndefined(start) && nullOrUndefined(end)) {
    mm = randMinMax(0, width * height);
    mm = randMinMax2(mm[0], mm[1]);
  } else if(!nullOrUndefined(start) && nullOrUndefined(end)) {
    mm = randMinMax(start, randMinMax2(width * height)[1]);
  } else if(nullOrUndefined(start) && !nullOrUndefined(end)) {
    mm = randMinMax(randMinMax2((width * height) - end)[0], end);
  } else {
    mm = [start, end];
  }
  cut = data.subarray(mm[0], mm[1]);
  dir = nullOrUndefined(dir)? coinToss() : dir;
  if (dir) {
    Array.prototype.sort.call(cut, leftSort);
  } else {
    Array.prototype.sort.call(cut, rightSort);
  }

  this.bitmap.data = Buffer.from(data.buffer);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * shortdumbsort
 * @param {integer} start - pixel to start at
 * @param {integer} end - pixel to end at
 */
jimp.Jimp.prototype.shortdumbsort = function shortdumbsort(start, end, cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = new Uint32Array(this.bitmap.data.buffer);
  let mm;
  if (nullOrUndefined(start) && nullOrUndefined(end)) {
    mm = randMinMax(0, width * height);
    mm = randMinMax2(mm[0], mm[1]);
  } else if(!nullOrUndefined(start) && nullOrUndefined(end)) {
    mm = randMinMax(start, randRange(start, width * height));
  } else if(nullOrUndefined(start) && !nullOrUndefined(end)) {
    mm = randMinMax(randRange(0, (width * height) - end), end);
  } else {
    mm = [start, end];
  }
  try {
    const da = data.subarray(mm[0], mm[1] % data.length);
    debug("subarray length:", da.length, "start", mm[0], "end", mm[1]);
    Array.prototype.sort.call(da);
    debug("data length:", data.length, "offset", mm[0], "size", mm[0] + da.length);
    data.set(da, mm[0]);
    this.bitmap.data = Buffer.from(data);
  } catch (err) {
    console.error(err);
  }
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * sort
 * @param {boolean} direction - T/F for Left or Right
 */
jimp.Jimp.prototype.sort = function sort(dir, cb) {
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

/**
 * slicesort
 * @param {boolean} direction - direction to sort, T/F for Left or Right
 * @param {integer} start - pixel to start at
 * @param {integer} end - pixel to end at
 */
jimp.Jimp.prototype.slicesort = function slicesort(dir, start, end, cb) {
  let width = this.bitmap.width,
    height = this.bitmap.height,
    mm,
    data = new Uint32Array(this.bitmap.data);
  dir = nullOrUndefined(dir)? coinToss() : dir;

  if (nullOrUndefined(start) && nullOrUndefined(end)) {
    mm = randMinMax(0, width * height);
    mm = randMinMax2(mm[0], mm[1]);
  } else if(!nullOrUndefined(start) && nullOrUndefined(end)) {
    mm = randMinMax(start, randMinMax2(width * height)[1]);
  } else if(nullOrUndefined(start) && !nullOrUndefined(end)) {
    mm = randMinMax(randMinMax2((width * height) - end)[0], end);
  } else {
    mm = [start, end];
  }

  const cut = data.subarray(mm[0], mm[1]),
    offset = Math.abs(randRound(data.length) - cut.length) % data.length;
  if(dir) {
    Array.prototype.sort.call(cut, leftSort);
  } else {
    Array.prototype.sort.call(cut, rightSort);
  }
  data.set(data.buffer, coinToss() ? offset : mm[0]);

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * sortStripe
 * @param {boolean} direction - pixel to start at
 * @param {integer} start - pixel to start at
 * @param {integer} end - pixel to end at
 */
jimp.Jimp.prototype.sortStripe = function sortStripe(dir, start, end, cb) {
  let width = this.bitmap.width,
    height = this.bitmap.height,
    data = new Uint32Array(this.bitmap.data),
    mm;

  if (nullOrUndefined(start) && nullOrUndefined(end)) {
    mm = randMinMax(0, width * height);
    mm = randMinMax2(mm[0], mm[1]);
  } else if(!nullOrUndefined(start) && nullOrUndefined(end)) {
    mm = randMinMax(start, randMinMax2(width * height)[1]);
  } else if(nullOrUndefined(start) && !nullOrUndefined(end)) {
    mm = randMinMax(randMinMax2((width * height) - end)[0], end);
  } else {
    mm = [start, end];
  }

  for (let i = 0, size = data.length + 1; i < size; i += width) {
    const da = data.subarray(i + mm[0], i + mm[1]);
    Array.prototype.sort.call(da, leftSort);
    da.copyWithin(data, i + mm[0]);
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * sortRows
 */
jimp.Jimp.prototype.sortRows = function sortRows(cb) {
  const width = this.bitmap.width,
    data = new Uint32Array(this.bitmap.data);

  for (let i = 0, size = data.length + 1; i < size; i += width) {
    const da = data.subarray(i, i + width);
    Array.prototype.sort.call(da, leftSort);
    da.copyWithin(data, i);
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * randomSortRows
 */
jimp.Jimp.prototype.randomSortRows = function randomSortRows(cb) {
  const width = this.bitmap.width,
    data = new Uint32Array(this.bitmap.data);
  for (let i = 0, size = data.length; i < size; i += width) {
    const da = data.subarray(i, i + width);
    Array.prototype.sort.call(da, coinToss);
    data.set(da, i);
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * dumbSortRows
 */
jimp.Jimp.prototype.dumbSortRows = function dumbsSortRows(cb) {
  const width = this.bitmap.width;
    this.bitmap.height;
    const data = new Uint32Array(this.bitmap.data);

  for (let i = 0, size = data.length; i < size; i += width) {
    const da = data.subarray(i, i + width);
    Array.prototype.sort.call(da);
    data.set(da, i);
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * pixelSort
 */
jimp.Jimp.prototype.pixelSort = function pixelSort(cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = new Uint32Array(this.bitmap.data);
  for (let i = 0, size = data.length; i < size; i += width) {
    const row = Array.apply([], data.subarray(i, i + width));
    let low = 0, high = 0;
    for (const j in row) {
      if (!high && !low && row[j] >= low) {
        low = j;
      }
      if (low && !high && row[j] >= high) {
        high = j;
      }
    }
    if (low) {
      const da = row.slice(low, high);
      Array.prototype.sort.call(da, leftSort);
      data.set(da, (i + low) % (height * width));
    }
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * randomGlitch - randomly choose glitch functions to perform on the incoming image
 */
jimp.Jimp.prototype.randomGlitch = function (cb) {
  const history = [];
  // enumerate glitch functions
  const glitches = [];
  for (const prop in jimp.Jimp.prototype) {
    if (typeof jimp.Jimp.prototype[prop] === "function" &&
				jimp.Jimp.prototype[prop].name){
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

  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Glitch - randomly choose glitch functions to perform on the incoming image
 */
jimp.Jimp.prototype.glitch = function (cb) {
  for (let i = 0, l = randRange(5, 10); i < l; i++) {
    switch (randFloor(13)) {
    case 0:
      this.focusImage();
      break;
    case 1:
      this.ditherBitmask();
      break;
    case 2:
      this.superSlice();
      break;
    case 3:
      this.colorShift();
      break;
    case 4:
      this.ditherRandom3();
      break;
    case 5:
      this.ditherBayer3();
      break;
    case 6:
      this.ditherAtkinsons();
      break;
    case 7:
      this.ditherFloydSteinberg();
      break;
    case 8:
      this.ditherHalftone();
      break;
    case 9:
      this.dither8Bit();
      break;
    case 10:
      if (coinToss()) {
        const picker = randFloor(3);
        if (picker == 1) {
          this.redShift();
        } else if (picker == 2) {
          this.greenShift();
        } else {
          this.blueShift();
        }
      }
      break;
    default:
      this.inverse();
      break;
    }
  }
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Preset - sequentially run ___ with random parameters
 * number - which preset to run (1-4) (default to 5 random glitches)
 */
jimp.Jimp.prototype.preset = function (number, cb) {
  let ops = [];
  switch(number) {
  case 1:
    ops = ["ditherRandom3", "shortsort", "slice", "invert", "shortsort", "shortsort", "ditherRandom3", "drumrollVerticalWave", "ditherBayer3", "dumbSortRows", "slicesort", "drumrollVertical"];
    break;
  case 2:
    ops = ["shortsort", "slice", "fractalGhosts", "sort", "fractalGhosts", "colorShift"];
    break;
  case 3:
    ops = ["ditherRandom3", "focusImage", "scanlines"];
    break;
  case 4:
    ops = ["ditherAtkinsons", "focusImage", "ditherRandom3", "focusImage"];
    break;
  default:
    ops = ["glitch"];
    break;
  }
  for (const i in ops) {
    debug(ops[i]);
    this[ops[i]]();
  }
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Focus Image
 * @param {number} pixelation - size of pixels to use for pixelization
 */
jimp.Jimp.prototype.focusImage = function focusImage(pixelation, cb) {
  if (!nullOrUndefined(pixelation)) {
    if ("number" !== typeof pixelation)
      return throwError.call(this, "pixelation must be a number", cb);
    if (pixelation < 2)
      return throwError.call(this, "pixelation must be greater than 1", cb);
  }
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = new Uint32Array(this.bitmap.data.buffer);
  pixelation = !nullOrUndefined(pixelation) ? pixelation : randRange(2, 10);
  for (let y = 0; y < height; y += pixelation) {
    for (let x = 0; x < width; x += pixelation) {
      const i = (y * width + x);
      for (let n = 0; n < pixelation; n++) {
        for (let m = 0; m < pixelation; m++) {
          if (x + m < width) {
            const j = ((width * (y + n)) + (x + m));
            data[j] = data[i];
          }
        }
      }
    }
  }
  this.bitmap.data.writeUInt32BE(data, 0);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * rgb_glitch
 * @param {number} offset - pixels to offset
 * @param {number} rgb - number representing R (0), G (1), or B (2)
 * @param {boolean} direction - shift pixels left or right, truthy for left, falsey for right
 */
jimp.Jimp.prototype.rgb_glitch = function rgb_glitch(offset, rgb, dir, cb) {
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

/**
 * inverse
 */
jimp.Jimp.prototype.inverse = function inverse(cb) {
  this.bitmap.width;
    this.bitmap.height;
    const data = new Uint32Array(this.bitmap.data);
  for (let i = 0; i < data.length; i++) {
    data[i] = ~ data[i] | 0xFF000000;
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Slice
 * @param {number} cutstart - datapoint to begin cut
 * @param {number} cutend - datapoint to finalize cut
 */
jimp.Jimp.prototype.slice = function slice(cutstart, cutend, cb) {
  if (!nullOrUndefined(cutstart)) {
    if ("number" !== typeof cutstart)
      return throwError.call(this, "cutstart must be a number", cb);
    if (cutstart > 0 && cutstart < cutend)
      return throwError.call(this, "cutstart must be greater than 0 and less than cutend", cb);
  }
  if (!nullOrUndefined(cutend)) {
    if ("number" !== typeof cutend)
      return throwError.call(this, "cutend must be a number", cb);
    if (cutend > 0 && cutend > cutstart)
      return throwError.call(this, "cutend must be greater than 0 and greater than cutstart", cb);
  }
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  cutend = !nullOrUndefined(cutend) ? cutend : randFloor(width * height * 4);
  cutstart = !nullOrUndefined(cutstart) ? cutstart : Math.floor(cutend / 1.7);
  const cut = data.subarray(cutstart, cutend);
  debug("slice::\ncut: %s, start: %s, end: %s", cut.length, cutstart, cutend);
  data.set(cut, randFloor((width * height * 4) - cut.length) || 0);
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * scanlines
 * @param {number} type - 0 for xor, 1 for or, or 2 for invert
 * @param {number} size - size between scanlines, numbers between 3 and 15 look nice
 * @param {number} option - 0, 1, 2, or 3, to determine which value to use with Or or Xor
 */
jimp.Jimp.prototype.scanlines = function scanlines(type, size, option, cb) {
  const width = this.bitmap.width;
    this.bitmap.height;
    const data = new Uint32Array(this.bitmap.data),
    xorOptions = [0x00555555, 0x00FF00FF00, 0x00F0F0F0, 0x00333333],
    orOptions = [0xFF555555, 0xFFFF00FF00, 0xFFF0F0F0, 0xFF333333];

  type = nullOrUndefined(type) ? randRange(0, 3) : type % 3;
  size = nullOrUndefined(size) ? randRange(3, 15) : size;
  const xorNum = nullOrUndefined(option) ? randChoice(xorOptions) : xorOptions[option];
  const orNum = nullOrUndefined(option) ? randChoice(orOptions) : orOptions[option];
  for (let i = 0, l = data.length; i < l; i += (width * size)) {
    const row = Array.apply([], data.subarray(i, i + width));
    for (const p in row) {
      if (type === 0) {
        row[p] = row[p] ^ xorNum;
      } else if (type === 1) {
        row[p] = row[p] | orNum;
      } else {
        // invert
        row[p] = ~ row[p] | 0xFF000000;
      }
    }
    data.set(row, i);
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Fractal Ghosts
 * @param {number} type - A number from 0-3 determining which algorithm to use
 * @param {number} color - The color channel to use to create the ghosts
 */
jimp.Jimp.prototype.fractalGhosts = function fractalGhosts(type, color, cb) {
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
  this.bitmap.width;
    this.bitmap.height;
    let data = this.bitmap.data,
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
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Fractal
 * @param {number} type - A number from (currently 0 or 1) determining which algorithm to use
 */
jimp.Jimp.prototype.fractal = function fractal(type, cb) {
  if(!nullOrUndefined(type)) {
    if (typeof type !== "number")
      return throwError.call(this, "type must be a number", cb);
    if (type < 0 || type > 1)
      return throwError.call(this, "type must be a 0 or 1", cb);
  }
  this.bitmap.width;
    this.bitmap.height;
    const data = this.bitmap.data;
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
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * drumrollHorizontal
 */
jimp.Jimp.prototype.drumrollHorizontal = function drumrollHorizontal(cb) {
  let width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data,
    roll = 0;
  for (let x = 0; x < width; x++) {
    if (Math.random() < 0.05) roll = randFloor(height);
    if (Math.random() < 0.05) roll = 0;

    for (let y = 0; y < height; y++) {
      const idx = (x + y * width) * 4;

      let x2 = x + roll;
      if (x2 > width - 1) x2 -= width;
      const idx2 = (x2 + y * width) * 4;

      for (let c = 0; c < 4; c++) {
        data[idx2 + c] = data[idx + c];
      }
    }
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * drumrollVertical
 */
jimp.Jimp.prototype.drumrollVertical = function drumrollVertical(cb) {
  // borrowed from https://github.com/ninoseki/glitched-canvas
  let width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data,
    roll = 0;
  for (let x = 0; x < width; x++) {
    if (Math.random() > 0.95) roll = randFloor(height);
    if (Math.random() > 0.95) roll = 0;

    for (let y = 0; y < height; y++) {
      const idx = (x + y * width) * 4;

      let y2 = y + roll;
      if (y2 > height - 1) y2 -= height;
      const idx2 = (x + y2 * width) * 4;

      for (let c = 0; c < 4; c++) {
        data[idx2 + c] = data[idx + c];
      }
    }
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

jimp.Jimp.prototype.drumrollHorizontalWave = function drumrollHorizontalWave(cb) {
  // borrowed from https://github.com/ninoseki/glitched-canvas & modified with cosine
  let width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data,
    roll = 0;
  for (let x = 0; x < width; x++) {
    if (Math.random() > 0.95) roll = Math.floor(Math.cos(x) * (height * 2));
    if (Math.random() > 0.98) roll = 0;

    for (let y = 0; y < height; y++) {
      const idx = (x + y * width) * 4;

      let x2 = x + roll;
      if (x2 > width - 1) x2 -= width;
      const idx2 = (x2 + y * width) * 4;

      for (let c = 0; c < 4; c++) {
        data[idx2 + c] = data[idx + c];
      }
    }
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * drumrollVerticalWave
 */
jimp.Jimp.prototype.drumrollVerticalWave = function drumrollVerticalWave(cb) {
  // borrowed from https://github.com/ninoseki/glitched-canvas & modified w/ cosine
  let width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data,
    roll = 0;

  for (let x = 0; x < width; x++) {
    if (Math.random() > 0.95) roll = Math.floor(Math.cos(x) * (height * 2));
    if (Math.random() > 0.98) roll = 0;

    for (let y = 0; y < height; y++) {
      const idx = (x + y * width) * 4;

      let y2 = y + roll;
      if (y2 > height - 1) y2 -= height;
      const idx2 = (x + y2 * width) * 4;

      for (let c = 0; c < 4; c++) {
        data[idx2 + c] = data[idx + c];
      }
    }
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Dither: Bitmask
 * @param {number} mask - number with which to mask each color channel 1-254
 */
jimp.Jimp.prototype.ditherBitmask = function ditherBitmask(mask, cb) {
  if (!nullOrUndefined(mask)) {
    if ("number" !== typeof mask)
      return throwError.call(this, "mask must be a number", cb);
    if (mask < 0 || mask > 254)
      return throwError.call(this, "mask must be a number from 0 to 2", cb);
  }
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data,
    M = !nullOrUndefined(mask) ? mask : randRange(1, 125);
  // 0xc0; 2 bits
  // 0xe0  3 bits
  // 0xf0  4 bits
  for (let i = 0, size = width * height * 4; i < size; i += 4) {
    data[i] |= M;
    data[i + 1] |= M;
    data[i + 2] |= M;
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

// todo: rewrite colorShift functions to match Jimp.prototype.sepia

jimp.Jimp.prototype.colorShift = function colorShift(dir, cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  dir = nullOrUndefined(dir) ? coinToss() : dir;
  if (!nullOrUndefined(dir) && typeof (!!dir) !== "boolean") {
    return throwError.call(this, "dir must be truthy or falsey", cb);
  }
  for (let i = 0, size = width * height * 4; i < size; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    data[i] = dir ? g : b;
    data[i + 1] = dir ? b : r;
    data[i + 2] = dir ? r : g;
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Dither: Random - dither according to noise
 */
jimp.Jimp.prototype.ditherRandom = function ditherRandom(cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  for (var i = 0, val, scaled, size = width * height * 4; i < size; i += 4) {
    scaled = ((data[i] + data[i + 1] + data[i + 2]) / 3) % 255;
    val = scaled < randRound(128) ? 0 : 0xff;
    data[i] = data[i + 1] = data[i + 2] = val;
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;

};

/**
 * Dither: Bayer
 * @param {number} map - which matrix to use for the threshold map - 0: 3x3,  1: 4x4, 2: 8x8
 */

jimp.Jimp.prototype.ditherBayer = function ditherBayer(map, cb) {
  map = !nullOrUndefined(map) ? map : randFloor(3);
  if ("number" !== typeof map)
    return throwError.call(this, "map must be a number", cb);
  if (map < 0 || map > 2)
    return throwError.call(this, "map must be a number from 0 to 2", cb);

  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data,
    /* added more threshold maps and the randomizer, the rest is stock */
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
      const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
      const scaled = (gray * 17) / 255;
      const val = scaled < threshold_map[x % size][y % size] ? 0 : 0xff;
      data[i] = data[i + 1] = data[i + 2] = val;
    }
  }

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Red Shift
 * @param {number} factor - factor by which to reduce green and blue channels and boost red channel
 */
jimp.Jimp.prototype.redShift = function redShift(factor, cb) {
  if (!nullOrUndefined(factor)) {
    if ("number" !== typeof factor)
      return throwError.call(this, "factor must be a number", cb);
    if (factor < 2)
      return throwError.call(this, "factor must be greater than 1", cb);
  }
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  factor = !nullOrUndefined(factor) ? factor : randFloor(64);
  for (let i = 0, size = width * height * 4; i < size; i += 4) {
    const shift = data[i] + factor;
    data[i] = (shift) > 255 ? 255 : shift;
    data[i + 1] -= factor;
    data[i + 2] -= factor;
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

jimp.Jimp.prototype.greenShift = function greenShift(factor, cb) {
  if (!nullOrUndefined(factor)) {
    if ("number" !== typeof factor)
      return throwError.call(this, "factor must be a number", cb);
    if (factor < 2)
      return throwError.call(this, "factor must be greater than 1", cb);
  }
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  factor = !nullOrUndefined(factor) ? factor : randFloor(64);
  for (let i = 0, size = width * height * 4; i < size; i += 4) {
    const shift = data[i + 1] + factor;
    data[i] -= factor;
    data[i + 1] = (shift) > 255 ? 255 : shift;
    data[i + 2] -= factor;
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Blue Shift
 * @param {number} factor - factor by which to reduce red and green channels and boost blue channel
 */
jimp.Jimp.prototype.blueShift = function blueShift(factor, cb) {
  if (!nullOrUndefined(factor)) {
    if ("number" !== typeof factor)
      return throwError.call(this, "factor must be a number", cb);
    if (factor < 2)
      return throwError.call(this, "factor must be greater than 1", cb);
  }
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  factor = !nullOrUndefined(factor) ? factor : randFloor(64);
  for (let i = 0, size = width * height * 4; i < size; i += 4) {
    const shift = data[i + 2] + factor;
    data[i] -= factor;
    data[i + 1] -= factor;
    data[i + 2] = (shift) > 255 ? 255 : shift;
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Super Shift
 * @param {number} iter - number of times to shift color values
 * @param {boolean} dir - direction to shift colors, true for RGB->GBR, false for RGB->BRG.
 */
jimp.Jimp.prototype.superShift = function superShift(iter, dir, cb) {
  if (!nullOrUndefined(iter)) {
    if ("number" !== typeof iter)
      return throwError.call(this, "iter must be a number", cb);
    if (iter < 2)
      return throwError.call(this, "iter must be greater than 1", cb);
  }
  if (!nullOrUndefined(dir))
    return throwError.call(this, "dir must be truthy or falsey", cb);
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  dir = !nullOrUndefined(dir) ? dir : coinToss();
  iter = !nullOrUndefined(iter) ? iter : randRange(1, 10);
  for (let i = 0, l = iter; i < l; i++) {
    for (let j = 0, size = width * height * 4; j < size; j += 4) {
      const r = data[j],
        g = data[j + 1],
        b = data[j + 2];
      data[j] = dir ? g : b;
      data[j + 1] = dir ? b : r;
      data[j + 2] = dir ? r : g;
    }
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Super Slice
 * @param {number} iter - Number of times to perform an automatic slice
 */
jimp.Jimp.prototype.superSlice = function superSlice(iter, cb) {
  if (!nullOrUndefined(iter)) {
    if ("number" !== typeof iter)
      return throwError.call(this, "iter must be a number", cb);
    if (iter > 0)
      return throwError.call(this, "iter must be greater than 0", cb);
  }
  let width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data,
    cutend, cutstart;
  iter = !nullOrUndefined(iter) ? iter : 3;
  for (let i = 0; i < iter; i++ ) {
    switch (randRange(0,1)) {
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
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Dither: Atkinsons
 */
jimp.Jimp.prototype.ditherAtkinsons = function ditherAtkinsons(cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = 4 * (y * width + x);
      const old_r = data[i];
      const old_g = data[i + 1];
      const old_b = data[i + 2];
      const new_r = (old_r > 127) ? 0xff : 0;
      const new_g = (old_g > 127) ? 0xff : 0;
      const new_b = (old_b > 127) ? 0xff : 0;
      data[i] = new_r;
      data[i + 1] = new_g;
      data[i + 2] = new_b;
      const err_r = old_r - new_r;
      const err_g = old_g - new_g;
      const err_b = old_b - new_b;
      // Redistribute the pixel's error like this:
      //       *  1/8 1/8
      //  1/8 1/8 1/8
      //      1/8
      // The ones to the right...
      let adj_i = 0;
      if (x < width - 1) {
        adj_i = i + 4;
        adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1 / 8);
        // The pixel that's down and to the right
        if (y < height - 1) {
          adj_i = adj_i + (width * 4) + 4;
          adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1 / 8);
        }
        // The pixel two over
        if (x < width - 2) {
          adj_i = i + 8;
          adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1 / 8);
        }
      }
      if (y < height - 1) {
        // The one right below
        adj_i = i + (width * 4);
        adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1 / 8);
        if (x > 0) {
          // The one to the left
          adj_i = adj_i - 4;
          adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1 / 8);
        }
        if (y < height - 2) {
          // The one two down
          adj_i = i + (2 * width * 4);
          adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1 / 8);
        }
      }
    }
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Dither: Floyd-Steinberg
 */
jimp.Jimp.prototype.ditherFloydSteinberg = function ditherFloydSteinberg(cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = 4 * (y * width + x);
      const old_r = data[i];
      const old_g = data[i + 1];
      const old_b = data[i + 2];
      const new_r = (old_r > 127) ? 0xff : 0;
      const new_g = (old_g > 127) ? 0xff : 0;
      const new_b = (old_b > 127) ? 0xff : 0;
      data[i] = new_r;
      data[i + 1] = new_g;
      data[i + 2] = new_b;
      const err_r = old_r - new_r;
      const err_g = old_g - new_g;
      const err_b = old_b - new_b;
      // Redistribute the pixel's error like this:
      //   * 7
      // 3 5 1
      // The ones to the right...
      let right_i = 0, down_i = 0, left_i = 0, next_right_i = 0;
      if (x < width - 1) {
        right_i = i + 4;
        adjustPixelError(data, right_i, [err_r, err_g, err_b], 7 / 16);
        // The pixel that's down and to the right
        if (y < height - 1) {
          next_right_i = right_i + (width * 4);
          adjustPixelError(data, next_right_i, [err_r, err_g, err_b],
            1 / 16);
        }
      }
      if (y < height - 1) {
        // The one right below
        down_i = i + (width * 4);
        adjustPixelError(data, down_i, [err_r, err_g, err_b], 5 / 16);
        if (x > 0) {
          // The one down and to the left...
          left_i = down_i - 4;
          adjustPixelError(data, left_i, [err_r, err_g, err_b], 3 /
							16);
        }
      }
    }
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Dither: Halftone
 */
jimp.Jimp.prototype.ditherHalftone = function ditherHalftone(cb) {
  const width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data;
  for (let y = 0; y <= height - 2; y += 3) {
    for (let x = 0; x <= width - 2; x += 3) {
      let sum_r = 0, sum_g = 0, sum_b = 0;
      const indexed = [];
      for (let s_y = 0; s_y < 3; s_y++) {
        for (let s_x = 0; s_x < 3; s_x++) {
          const i = 4 * (width * (y + s_y) + (x + s_x));
          sum_r += data[i];
          sum_g += data[i + 1];
          sum_b += data[i + 2];
          data[i] = data[i + 1] = data[i + 2] = 0xff;
          indexed.push(i);
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

  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Dither: 8 bits
 * @param {number} size - a number greater than 1 representing pixel size.
 */
jimp.Jimp.prototype.dither8Bit = function dither8Bit(size, cb) {
  size = nullOrUndefined(size) ? randRange(4, 15) : size;
  if (typeof size !== "number") {
    return throwError.call(this, "size must be a number " + size, cb);
  }
  if (size < 2) {
    return throwError.call(this, "size must be greater than 1", cb);
  }

  let width = this.bitmap.width,
    height = this.bitmap.height,
    data = this.bitmap.data,
    sum_r, sum_g, sum_b, avg_r, avg_g, avg_b;

  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      sum_r = 0;
      sum_g = 0;
      sum_b = 0;
      var s_y, s_x, i;
      for (s_y = 0; s_y < size; s_y++) {
        for (s_x = 0; s_x < size; s_x++) {
          i = 4 * (width * (y + s_y) + (x + s_x));
          sum_r += data[i];
          sum_g += data[i + 1];
          sum_b += data[i + 2];
        }
      }
      avg_r = (sum_r / (size * size)) > 127 ? 0xff : 0;
      avg_g = (sum_g / (size * size)) > 127 ? 0xff : 0;
      avg_b = (sum_b / (size * size)) > 127 ? 0xff : 0;
      for (s_y = 0; s_y < size; s_y++) {
        for (s_x = 0; s_x < size; s_x++) {
          i = 4 * (width * (y + s_y) + (x + s_x));
          data[i] = avg_r;
          data[i + 1] = avg_g;
          data[i + 2] = avg_b;
        }
      }
    }
  }
  this.bitmap.data = Buffer.from(data);
  if (isNodePattern(cb)) return cb.call(this, null, this);
  else return this;
};

/**
 * Gleech.js
 * Copyright (C) 2025 jkirchartz <me@jkirchartz.com>
 *
 * Extend JIMP with glitches
 *
 * Distributed under terms of the GPL 3.0 (General Public License) license.
 */


// Glitch function categories for UI selection
const glitchCategories = {
  exp: [
    'pixelFunk', 'superPixelFunk', 'shortsort', 'shortdumbsort',
    'sort', 'slicesort', 'sortStripe', 'sortRows', 'randomSortRows', 'dumbSortRows',
    'pixelSort', 'randomGlitch', 'glitch', 'preset1', 'preset2', 'preset3', 'preset4'
  ],
  orig: [
    'focusImage', 'rgb_glitch', 'invert', 'slice', 'scanlines',
    'fractalGhosts', 'fractal',
    'drumrollHorizontal', 'drumrollVertical', 'drumrollHorizontalWave',
    'drumrollVerticalWave', 'ditherBitmask', 'colorShift',
    'ditherRandom', 'ditherRandom3', 'ditherBayer', 'ditherBayer3', 'redShift',
    'greenShift', 'blueShift', 'superShift', 'superSlice',
    'ditherAtkinsons', 'ditherFloydSteinberg', 'ditherHalftone', 'dither8bit'
  ]
};

Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () { return jimp.Jimp; }
});
exports.adjustPixelError = adjustPixelError;
exports.blueSort = blueSort;
exports.coinToss = coinToss;
exports.debug = debug;
exports.glitchCategories = glitchCategories;
exports.greenSort = greenSort;
exports.hueSort = hueSort;
exports.isNodePattern = isNodePattern;
exports.leftSort = leftSort;
exports.nullOrUndefined = nullOrUndefined;
exports.randChance = randChance;
exports.randChoice = randChoice;
exports.randFloor = randFloor;
exports.randMinMax = randMinMax;
exports.randMinMax2 = randMinMax2;
exports.randRange = randRange;
exports.randRound = randRound;
exports.randSort = randSort;
exports.redSort = redSort;
exports.rightSort = rightSort;
exports.sum = sum;
exports.throwError = throwError;
//# sourceMappingURL=gleech.cjs.map
