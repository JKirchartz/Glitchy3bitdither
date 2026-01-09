/*
 * chooser.js (Modernized)
 * Copyleft (ↄ) 2025 kirch <kirch@arp>
 * Distributed under terms of the GPL 3.0 (General Public License) license.
 */

import { gleech } from '../GlitchyDither.js';

const picker = document.createElement('select');
const form = document.getElementById('form');
let functions = [...gleech.orig, ...gleech.exp, 'theWorks', 'glitch', 'randomGlitch'];
functions = functions.sort();
functions.unshift('original');

// Populate picker
functions.forEach(fn => {
  const opt = document.createElement('option');
  opt.value = fn;
  opt.textContent = fn;
  picker.appendChild(opt);
});
form.appendChild(picker);

let img, orig_img;
const apply = document.getElementById('apply');
const replace = document.getElementById('replace');
replace.disabled = true;

apply.addEventListener('click', () => place(false));
replace.addEventListener('click', () => place(true));

function place(replaceImg) {
  const tmp = document.getElementsByTagName('img');
  if (replaceImg && tmp.length) {
    document.getElementById('output').removeChild(tmp[0]);
  }
  generate(tmp[0], picker.value);
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file.type.match('image.*')) return;
  const reader = new FileReader();
  reader.onload = e => {
    img = document.createElement('img');
    img.onload = () => {
      orig_img = img;
      generate(img, 'original');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  document.getElementById('output').innerHTML = '';
}

function generate(img, chosen) {
  if (document.getElementsByTagName('img').length >= 1) {
    replace.disabled = false;
  }
  const width = img.width;
  const height = img.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (chosen === 'original') {
    ctx.drawImage(orig_img, 0, 0);
  } else {
    ctx.drawImage(img, 0, 0);
  }
  drawDitherResult(canvas, chosen, false, false);
}

document.getElementById('uploader').addEventListener('change', handleFileSelect, false);

