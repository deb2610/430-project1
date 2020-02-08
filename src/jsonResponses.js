//
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};
const respondXML = (request, response, status, message, id) => {
  let responseXML = '<response>';
  responseXML = `${responseXML} <message>${message}</message>`;
  responseXML = `${responseXML} <id>${id}</id>`;
  responseXML = `${responseXML} </response>`;

  response.writeHead(status, { 'Content-Type': 'text/xml' });
  response.write(responseXML);
  response.end();
};
//
const success = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'This is a successful response',
  };
  // console.dir('success accepted type '+acceptedTypes[0])
  if (acceptedTypes[0] === 'text/xml') {
    return respondXML(request, response, 200, 'This is a successful response', 'Success');
  }
  return respondJSON(request, response, 200, responseJSON);
};
//
const badRequest = (request, response, acceptedTypes, params) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };
  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query param set to true';
    responseJSON.id = 'badRequest';
    if (acceptedTypes[0] === 'text/xml') {
      return respondXML(request, response, 400, responseJSON.message, responseJSON.id);
    }
    return respondJSON(request, response, 400, responseJSON);
  }
  if (acceptedTypes[0] === 'text/xml') {
    return respondXML(request, response, 200, responseJSON.message, responseJSON.id);
  }
  return respondJSON(request, response, '200', responseJSON);
};
//
const unauthorized = (request, response, acceptedTypes, params) => {
  const responseJSON = {
    message: 'This request has the required parameters',
    id: 'authorized',
  };
  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseJSON.message = 'Missing loggedIn query param set to yes';
    responseJSON.id = 'unauthorized';
    if (acceptedTypes[0] === 'text/xml') {
      return respondXML(request, response, 401, responseJSON.message, responseJSON.id);
    }
    return respondJSON(request, response, 401, responseJSON);
  }
  if (acceptedTypes[0] === 'text/xml') {
    return respondXML(request, response, 200, responseJSON.message, responseJSON.id);
  }
  return respondJSON(request, response, '200', responseJSON);
};
//
const forbidden = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'This is forbidden',
    id: 'forbidden',
  };
  if (acceptedTypes[0] === 'text/xml') {
    return respondXML(request, response, 403, responseJSON.message, responseJSON.id);
  }
  return respondJSON(request, response, 403, responseJSON);
};
//
const internal = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'Internal Server Error',
    id: 'internal',
  };
  if (acceptedTypes[0] === 'text/xml') {
    return respondXML(request, response, 500, responseJSON.message, responseJSON.id);
  }
  return respondJSON(request, response, 500, responseJSON);
};
//
const notImplemented = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'Code not handled by server',
    id: 'notImplemented',
  };
  if (acceptedTypes[0] === 'text/xml') {
    return respondXML(request, response, 501, responseJSON.message, responseJSON.id);
  }
  return respondJSON(request, response, 501, responseJSON);
};

const notFound = (request, response, acceptedTypes) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  if (acceptedTypes[0] === 'text/xml') {
    return respondXML(request, response, 404, responseJSON.message, responseJSON.id);
  }
  return respondJSON(request, response, 404, responseJSON);
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
