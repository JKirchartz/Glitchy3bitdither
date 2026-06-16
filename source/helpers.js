/***************************************************
 * Helper Functions
 ***************************************************/

export function throwError(err, cb) {
  debug("throwError called", err);
  if (typeof err === "string") err = new Error(err);
  if (typeof cb === "function") return cb.call(this, err);
  else throw err;
}

export function adjustPixelError(data, i, error, multiplier) {
  data[i] = data[i] + multiplier * error[0];
  data[i + 1] = data[i + 1] + multiplier * error[1];
  data[i + 2] = data[i + 2] + multiplier * error[2];
}

export function nullOrUndefined(item) {
  if (typeof item === "undefined" || item === null) {
    return true;
  }
  return false;
}

// return random # < a
export function randFloor(a) {return Math.floor(Math.random() * a);}
// return random # <= a
export function randRound(a) {return Math.round(Math.random() * a);}
// return random # between A & B
export function randRange(a, b) {return Math.round(Math.random() * b) + a;}
// relatively fair 50/50
export function coinToss() {return Math.random() > 0.5;}
export function randMinMax(min, max) {
  // generate min & max values by picking
  // one 'fairly', then picking another from the remainder
  const randA = Math.round(randRange(min, max));
  const randB = Math.round(randRange(randA, max));
  return [randA, randB];
}
export function randMinMax2(min, max) {
  // generate min & max values by picking both fairly
  // then returning the lesser value before the greater.
  const randA = Math.round(randRange(min, max));
  const randB = Math.round(randRange(min, max));
  return randA < randB ? [randA, randB] : [randB, randA];
}
export function randChoice(arr) {
  return arr[randFloor(arr.length)];
}

export function randChance(percent) {
  // percent is a number 1-100
  return (Math.random() < (percent / 100));
}

export function sum(o) {
  for (var s = 0, i = o.length; i; s += o[--i]) {}
  return s;
}
export function leftSort(a, b) {return parseInt(a, 10) - parseInt(b, 10);}
export function rightSort(a, b) {return parseInt(b, 10) - parseInt(a, 10);}
export function blueSort(a, b) {
  const aa = a >> 24 & 0xFF,
    ar = a >> 16 & 0xFF,
    ag = a >> 8 & 0xFF,
    ab = a & 0xFF;
  const ba = b >> 24 & 0xFF,
    br = b >> 16 & 0xFF,
    bg = b >> 8 & 0xFF,
    bb = b & 0xFF;
  return aa - bb;
}
export function redSort(a, b) {
  const aa = a >> 24 & 0xFF,
    ar = a >> 16 & 0xFF,
    ag = a >> 8 & 0xFF,
    ab = a & 0xFF;
  const ba = b >> 24 & 0xFF,
    br = b >> 16 & 0xFF,
    bg = b >> 8 & 0xFF,
    bb = b & 0xFF;
  return ar - br;
}
export function greenSort(a, b) {
  const aa = a >> 24 & 0xFF,
    ar = a >> 16 & 0xFF,
    ag = a >> 8 & 0xFF,
    ab = a & 0xFF;
  const ba = b >> 24 & 0xFF,
    br = b >> 16 & 0xFF,
    bg = b >> 8 & 0xFF,
    bb = b & 0xFF;
  return ag - bg;
}
export function hueSort(a, b) {
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
export function randSort(a, b) {
  const sort = randChoice([coinToss, leftSort, rightSort, redSort, greenSort,
    blueSort, hueSort]);
  return sort(a, b);
}


export function isNodePattern(cb) {
  // borrowed from JIMP
  if ("undefined" === typeof cb) return false;
  if ("function" !== typeof cb)
    throw new Error("Callback must be a function");
  return true;
}

