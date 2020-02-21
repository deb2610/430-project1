"use strict";

var parseJSON = function parseJSON(xhr, content) {
  //parse response (obj will be empty in a 204 updated)
  var obj = JSON.parse(xhr.response);
  console.dir(obj); //if message in response, add to screen

  if (obj.message) {
    var p = document.createElement('p');
    p.textContent = "Message: ".concat(obj.message);
    content.appendChild(p);
  } //@dan or austin this is not working because obj.users in undefined for some reason
  //i didn't have a chance to fix it but its just page text output


  console.dir(obj.users);

  if (obj.users) {
    var userList = document.createElement('p');
    var users = JSON.stringify(obj.users);
    userList.textContent = users;
    content.appendChild(userList);
  }
}; //function to handle our response


var handleResponse = function handleResponse(xhr, parseResponse) {
  var content = document.querySelector('#output'); //check the status code

  switch (xhr.status) {
    case 200:
      //success
      content.innerHTML = "<b>Success</b>";
      break;

    case 201:
      //created
      content.innerHTML = '<b>Create</b>';
      break;

    case 204:
      //updated
      content.innerHTML = '<b>Updated (No Content)</b>';
      return;

    case 400:
      //bad request
      content.innerHTML = "<b>Bad Request</b>";
      break;

    default:
      //any other status code
      content.innerHTML = "Error code not implemented by client.";
      break;
  } //parse response 


  parseJSON(xhr, content);
  console.dir(xhr);

  if (parseResponse) {
    var obj = JSON.parse(xhr.response);
    content.innerHTML += "<p>".concat(obj, "</p>");
  } else {// content.innerHTML += `<p>meta Recived</p>`;
  }
}; //function to send our post request


var sendPost = function sendPost(e, nameForm) {
  e.preventDefault();
  var nameAction = nameForm.getAttribute('action');
  var nameMethod = nameForm.getAttribute('method');
  var nameField = nameForm.querySelector('#nameField');
  var ageField = nameForm.querySelector('#ageField');
  var xhr = new XMLHttpRequest();
  xhr.open(nameMethod, nameAction);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr, false);
  };

  var formData = "name=".concat(nameField.value, "&age=").concat(ageField.value); //send our request with the data

  xhr.send(formData); //return false to prevent the browser from trying to change page

  return false;
};

var ghRequest = function ghRequest(e, userForm) {
  console.dir("I AM IN ghRequest");
  e.preventDefault();
  var url = userForm.querySelector('#urlField').value;
  var method = userForm.querySelector('#methodSelect').value;
  var xhr = new XMLHttpRequest();
  console.dir("url: " + url);
  console.dir("Method: " + method);
  xhr.open(method, url);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  if (method === 'GET' || method === 'get') {
    console.dir(xhr);

    xhr.onload = function () {
      return handleResponse(xhr, true);
    };
  }

  if (method === 'HEAD') {
    xhr.onload = function () {
      return handleResponse(xhr, false);
    };
  }

  xhr.send();
  console.dir("Now Leaving ghRequest");
  return false;
};

var init = function init() {
  //grab form
  var nameForm = document.querySelector('#nameForm');
  var requestForm = document.querySelector('#requestForm'); //create handler

  var addUser = function addUser(e) {
    return sendPost(e, nameForm);
  };

  var getUsers = function getUsers(e) {
    return ghRequest(e, requestForm);
  };

  nameForm.addEventListener('submit', addUser);
  requestForm.addEventListener('submit', getUsers);
};

window.onload = init;
