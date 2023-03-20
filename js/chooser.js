/*
 * chooser.js
 * Copyleft (ↄ) 2016 kirch <kirch@arp>
 *
 * Distributed under terms of the GPL3.0 license.
 */


var picker = document.createElement("select"),
  form = document.getElementById("form"),
  functions = gleech.orig.concat(gleech.exp.concat(['theWorks','glitch','randomGlitch'])),
  functions = functions.sort(),
  orig_img;

functions.unshift('original');

/* populate picker */
for(var i=0, l = functions.length;i<l;i++){
  var opt = document.createElement("option");
  opt.value = functions[i];
  opt.innerHTML = functions[i];
  picker.appendChild(opt);
}
form.appendChild(picker);
function place(replace){
  var tmp = document.getElementsByTagName("img");
  if(replace){document.getElementById("output").removeChild(tmp[0]);}
  generate(tmp[0],picker.value);
}
var apply = document.getElementById('apply');
var replace = document.getElementById('replace');
apply.onclick = function(){place(false);};
replace.onclick = function(){place(true);};
replace.disabled = true;

function handleFileSelect(e) {
  var file = e.target.files[0];
  // Only process image files.
  if (!file.type.match('image.*')) {
    return;
  }
  var reader = new FileReader();
  // Closure to capture the file information.
  reader.onload = function(e) {
    var img = new Image();
		img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function() {
      orig_img = img;
      generate(img,"original");
    };
    img.src = "" + reader.result;
  };
	if(file) {
		reader.readAsDataURL(file);
	}
  document.getElementById("output").innerHTML = '';
}

function generate(img,chosen){
  /* setup */
  if (document.getElementsByTagName('img').length >= 1) {
    replace.disabled = false;
  }
  var width = img.width;
  var height = img.height;
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext('2d');
  /* execute */
  if(chosen == "original"){
    ctx.drawImage(orig_img,0,0);
  }else{
    ctx.drawImage(img,0,0);
  }

  drawDitherResult(canvas,chosen,false,false);
}

document.getElementById('uploader').addEventListener('change', handleFileSelect, false);

