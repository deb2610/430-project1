"use strict";

var currentName;

var parseJSON = function parseJSON(xhr, content) {
  //parse response (obj will be empty in a 204 updated)
  var obj = JSON.parse(xhr.response); //console.dir(obj);
  //if message in response, add to screen

  if (obj.message) {} // const p = document.createElement('p');
  // p.textContent = `Message: ${obj.message}`;
  // content.appendChild(p);
  //@dan or austin this is not working because obj.users in undefined for some reason
  //i didn't have a chance to fix it but its just page text output
  //console.dir(obj.users);


  if (obj.users) {
    var userList = document.createElement('p');
    var users = JSON.stringify(obj.users);
    userList.textContent = users; // content.appendChild(userList);
  }
}; //function to handle our response


var handleResponse = function handleResponse(xhr, parseResponse) {
  var content = document.querySelector('#calender'); //check the status code

  switch (xhr.status) {
    case 200:
      //success
      // content.innerHTML = `<b>Success</b>`;
      break;

    case 201:
      //created
      // content.innerHTML = '<b>Created</b>';
      break;

    case 204:
      //updated
      // content.innerHTML = '<b>Updated (No Content)</b>';
      return;

    case 400:
      //bad request
      // content.innerHTML = `<b>Bad Request</b>`;
      break;

    default:
      //any other status code
      content.innerHTML = "Error code not implemented by client.";
      break;
  } //parse response 


  parseJSON(xhr); //console.dir(xhr);

  if (parseResponse) {
    var obj = JSON.parse(xhr.response);
    var usersObjs = obj.users;
    var usersKeys = Object.keys(usersObjs.users);
    var userCount = Object.keys(obj)[0].length; // console.log(userCount);
    // console.dir(usersObjs.users);
    // console.dir(usersKeys);

    for (var i = 0; i < userCount; i++) {
      // console.dir(usersKeys[i]);
      if (usersKeys[i] === currentName) {
        var key = usersKeys[i]; // console.dir('key: '+key);

        var userToList = usersObjs.users['' + key]; // console.dir(userToList);

        if (userToList.username != 'username') {
          content.innerHTML += "<h2 class='dark fulllength-small'>".concat(userToList.username, "'s History</h2>");
        }

        var dateKeys = Object.keys(userToList);
        var dateVals = Object.values(userToList);
        console.dir(dateKeys);
        console.dir(dateVals);

        for (var k = 0; k < dateKeys.length; k++) {
          var calBox = document.createElement('div');
          calBox.classList.add('calBox');
          calender.appendChild(calBox);

          if (dateKeys[k] != 'username' || dateVals[k] != userToList.username) {
            var p = document.createElement('p');
            var moodPic = document.createElement('span');
            p.classList.add('dark');
            console.dir('current key ' + dateKeys[k]);
            console.dir('current val ' + dateVals[k]);
            p.textContent = "".concat(dateKeys[k], ": ");

            switch (dateVals[k].mood) {
              case "best":
                {
                  moodPic.innerHTML = '<img src="/best.png" alt="medium mood">';
                  break;
                }

              case "good":
                {
                  moodPic.innerHTML = '<img src="/good.png" alt="medium mood">';
                  break;
                }

              case "medium":
                {
                  moodPic.innerHTML = '<img src="/medium.png" alt="medium mood">';
                  break;
                }

              case "bad":
                {
                  moodPic.innerHTML = '<img src="/bad.png" alt="medium mood">';
                  break;
                }

              case "worst":
                {
                  moodPic.innerHTML = '<img src="/worst.png" alt="medium mood">';
                  break;
                }
            }

            calBox = document.querySelector('#calender').lastChild;
            calBox.appendChild(p);
            calBox.appendChild(moodPic);
          }
        }
      }
    }
  } else {// content.innerHTML += `<p>meta Recived</p>`;
  }
}; //function to send our post request


var sendPost = function sendPost(e, nameForm) {
  e.preventDefault();
  var nameAction = nameForm.getAttribute('action');
  var nameMethod = nameForm.getAttribute('method');
  var nameField = nameForm.querySelector('#nameField'); // const ageField = nameForm.querySelector('#ageField');

  var xhr = new XMLHttpRequest();
  xhr.open(nameMethod, nameAction);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr, false);
  };

  var formData = "name=".concat(nameField.value); //&age=${ageField.value}`;
  //send our request with the data

  xhr.send(formData); //return false to prevent the browser from trying to change page

  return false;
};

var sendPostMood = function sendPostMood(e, in_form) {
  e.preventDefault();
  var nameAction = in_form.getAttribute('action');
  var nameMethod = in_form.getAttribute('method');
  var moodField = document.querySelector('input[name="mood"]:checked');
  console.dir(moodField);
  var xhr = new XMLHttpRequest();
  xhr.open(nameMethod, nameAction);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.onload = function () {
    return handleResponse(xhr, false);
  };

  var formData = "mood=".concat(moodField.value); //&age=${ageField.value}`;

  console.dir(formData); //send our request with the data

  xhr.send(formData); //return false to prevent the browser from trying to change page

  return false;
};

var ghRequest = function ghRequest(e) {
  //console.dir("I AM IN ghRequest");
  // e.preventDefault();
  var url = '/getUsers';
  var method = "GET"; //userForm.querySelector('#methodSelect').value;

  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');

  if (method === 'GET' || method === 'get') {
    //console.dir(xhr);
    xhr.onload = function () {
      return handleResponse(xhr, true);
    };
  }

  if (method === 'HEAD') {
    xhr.onload = function () {
      return handleResponse(xhr, false);
    };
  }

  xhr.send(); //console.dir("Now Leaving ghRequest");

  return false;
};

var init = function init() {
  //grab form
  var nameForm = document.querySelector('#nameForm');
  var moodgrid = document.querySelector('#moodgrid');
  var nametagbox = document.querySelector('#nametag-box');
  var nametag = document.querySelector('#nametag');
  var calender = document.querySelector('#calender');
  var currentDate = document.querySelector('#currentDate'); //find a way to return this from the server

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!

  var yyyy = today.getFullYear();
  today = mm + '-' + dd + '-' + yyyy;
  currentDate.innerHTML = today; //create handler

  var addUser = function addUser(e) {
    sendPost(e, nameForm);
    currentName = nameField.value;
    nameForm.style.display = "none";
    nametag.innerHTML = "<b>Hi ".concat(currentName, "! How are you feeling?</b>");
    moodgrid.style.opacity = 1;
    nametag.classList.add('typewrite');
    nametagbox.style.opacity = 1;
  };

  var addMood = function addMood(e) {
    sendPostMood(e, moodgrid);
    var data = getUsers();
    moodgrid.style.display = "none";
    calender.style.opacity = 1;
  };

  var getUsers = function getUsers(e) {
    return ghRequest(e);
  };

  nameForm.addEventListener('submit', addUser);
  moodgrid.addEventListener('submit', addMood); // requestForm.addEventListener('submit', getUsers);
};

window.onload = init;
