
/**
 * drumrollHorizontalWave
 */
Jimp.prototype.drumrollHorizontalWave = function drumrollHorizontalWave(cb) {
	// borrowed from https://github.com/ninoseki/glitched-canvas & modified with cosine
	var width = this.bitmap.width,
	height = this.bitmap.height,
	data = this.bitmap.data,
	roll = 0;
	for (var x = 0; x < width; x++) {
		if (Math.random() > 0.95) roll = Math.floor(Math.cos(x) * (height * 2));
		if (Math.random() > 0.98) roll = 0;

		for (var y = 0; y < height; y++) {
			var idx = (x + y * width) * 4;

			var x2 = x + roll;
			if (x2 > width - 1) x2 -= width;
			var idx2 = (x2 + y * width) * 4;

			for (var c = 0; c < 4; c++) {
				data[idx2 + c] = data[idx + c];
			}
		}
	}

	this.bitmap.data = Buffer.from(data);
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};
