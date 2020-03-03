
const firebaseHandler = require('./firebaseHandler.js');

const users = {};
let currentUsername = '';
let fbUsers = '';

let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
const yyyy = today.getFullYear();

today = `${mm}-${dd}-${yyyy}`;

const getDateString = () => today;

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getFBUsers = async (request, response) => {
  console.dir('[1] Requesting FB data ');
  const result = await firebaseHandler.getUserData();

  if (!result) {
    console.dir('SOMETHING DONE GOOFED');
    return respondJSONMeta(request, response, 500);
  }

  console.dir('[5] UNPARSED: ');
  console.dir(result);

  const obj = JSON.parse(result);
  console.dir('[6] PARSED: ');
  console.dir(obj);
  const responseJSON = {
    // users: obj,
    users: obj.users,
  };
  fbUsers = obj;
  return respondJSON(request, response, 200, responseJSON);
};

const getUsers = async (request, response) => {
  await getFBUsers().catch(() => {});// console.dir("getFBUsers() has errored out")});
  const responseJSON = {
    users: fbUsers,
  };

  respondJSON(request, response, 200, responseJSON);
};
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function


const getUsersMeta = (request, response) => {
  respondJSON(request, response, 200);
};

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name is required.',
  };

  if (!body.name) { // || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  // console.dir("body.name");
  // console.dir(body.name);
  if (users[body.name]) {
    responseCode = 204;
  } else {
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  // users[body.name].age = body.age;
  currentUsername = users[body.name].name;


  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};

const addMood = (request, response, body) => {
  const responseJSON = {
    message: 'Must Select a Mood.',
  };

  if (!body.mood) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  // paste here mood is valid
  let responseCode = 201;
  const date = getDateString();
  // console.dir("users[currentUsername][''+date]:");
  // console.dir(users[currentUsername][""+date]);
  if (!users[currentUsername][`${date}`]) {
    users[currentUsername][`${date}`] = {};
  }

  if (users[currentUsername][`${date}`].mood) {
    responseCode = 204;
  } else {
    users[currentUsername][`${date}`].mood = {};
  }

  users[currentUsername][`${date}`].mood = body.mood;
  // users[body.name].age = body.age;

  firebaseHandler.writeUserData(currentUsername, currentUsername, date, body.mood);
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'the page you are looking for is not found',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);
module.exports = {
  getUsers,
  addUser,
  addMood,
  getUsersMeta,
  notFound,
  notFoundMeta,
  getDateString,
  getFBUsers,
};
