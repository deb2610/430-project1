const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const bundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const best = fs.readFileSync(`${__dirname}/../hosted/img/best.png`);
const good = fs.readFileSync(`${__dirname}/../hosted/img/good.png`);
const medium = fs.readFileSync(`${__dirname}/../hosted/img/medium.png`);
const bad = fs.readFileSync(`${__dirname}/../hosted/img/bad.png`);
const worst = fs.readFileSync(`${__dirname}/../hosted/img/worst.png`);
const firebasekey = fs.readFileSync(`${__dirname}/../src/firebase.json`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};
const getBundle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(bundle);
  response.end();
};
const getImgBest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(best);
  response.end();
};
const getImgGood = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(good);
  response.end();
};
const getImgMedium = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(medium);
  response.end();
};
const getImgBad = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(bad);
  response.end();
};
const getImgWorst = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(worst);
  response.end();
};
const getFirebase = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.write(firebasekey);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getBundle,
  getImgBest,
  getImgGood,
  getImgMedium,
  getImgBad,
  getImgWorst,
  getFirebase,
};
