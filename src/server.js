const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;


// handle POST requests
const handlePost = (request, response) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    jsonHandler.addUser(request, response, bodyParams);
  });
};
const handleMood = (request, response) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);
    console.dir(bodyString);
    console.dir('_____________');
    console.dir(bodyParams);
    jsonHandler.addMood(request, response, bodyParams);
  });
};
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/index.html': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/bundle.js': htmlHandler.getBundle,
    '/getUsers': jsonHandler.getUsers,
    '/getFBUsers': jsonHandler.getFBUsers,
    '/firebase.json': htmlHandler.getFirebase,
    '/best.png': htmlHandler.getImgBest,
    '/good.png': htmlHandler.getImgGood,
    '/medium.png': htmlHandler.getImgMedium,
    '/bad.png': htmlHandler.getImgBad,
    '/worst.png': htmlHandler.getImgWorst,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {
    '/addUser': handlePost,
    '/addMood': handleMood,
  },
};
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
