/*
 * Glitch Cruiser
 * Copyleft (ↄ) 2016 kirch <kirch@arp>
 *
 * Distributed under terms of the GPL 3.0 (General Public License) license.
 */

// count iterations of sequencer
var seqCounter = 0;

// extend gleech with sequencer
(function(gleech) {
  gleech.seqGlitch = function seqGlitch(imageData) {
    var fun = document.getElementById('experimental').checked ?  gleech.orig.concat(gleech.exp) : gleech.orig.slice(0),
      i = seqCounter % fun.length;
    seqCounter++;
    debug('seqGlitch', fun[i], seqCounter);
    return gleech[fun[i]](imageData);
  };
}(gleech || {}));

function generate(img){
  /* cleanup */
  document.getElementById("output").innerHTML = "";
  /* setup */
  var orig = img;
  var width = img.width;
  var height = img.height;
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  /* execute */
  for (var i = 1; i < 10;i++){
    if(i==5 && typeof img == "object"){
      ctx.drawImage(orig,0,0);
      drawDitherResult(canvas,"original",false,false);
      /* Original Image */
    }else{
      ctx.drawImage(img, 0, 0);
      drawDitherResult(canvas,'seqGlitch',false,false);
      /* generated from Original */
    }
  }
}

function handleFileSelect(e) {
  var file = e.target.files[0];
  // Only process image files.
  if (!file.type.match('image.*')) {
    return;
  }
  var reader = new FileReader();
  // Closure to capture the file information.
  reader.onload = function(e) {
    var img = document.createElement("img");
    img.onload = function() {
      generate(img);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  document.getElementById("output").innerHTML = "";
}

document.getElementById('output').onclick = function(e){
  if (e.target.tagName.toLowerCase() == 'img'){
    generate(e.target);
    e.preventDefault();
  }
};

document.getElementById('uploader').addEventListener('change', handleFileSelect, false);

