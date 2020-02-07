//
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};
//
const success = (request, response) => {
  const responseJSON = {
    message: 'This is a successful response',
  };

  respondJSON(request, response, 200, responseJSON);
};
//
const badRequest = (request, response, params) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };
  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query param set to true';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }
  return respondJSON(request, response, '200', responseJSON);
};
//
const unauthorized = (request, response, params) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };
  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseJSON.message = 'Missing loggedIn query param set to yes';
    responseJSON.id = 'unauthorized';
    return respondJSON(request, response, 401, responseJSON);
  }
  return respondJSON(request, response, '200', responseJSON);
};
//
const forbidden = (request, response) => {
  const responseJSON = {
    message: 'This is forbidden',
    id: 'forbidden',
  };

  respondJSON(request, response, 403, responseJSON);
};
//
const internal = (request, response) => {
  const responseJSON = {
    message: 'Internal Server Error',
    id: 'internal',
  };

  respondJSON(request, response, 500, responseJSON);
};
//
const notImplemented = (request, response) => {
  const responseJSON = {
    message: 'Code not handled by server',
    id: 'notImplemented',
  };

  respondJSON(request, response, 501, responseJSON);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
