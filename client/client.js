const parseJSON = (xhr, content) => {
  //parse response (obj will be empty in a 204 updated)
  const obj = JSON.parse(xhr.response);
  console.dir(obj);
  
  //if message in response, add to screen
  if(obj.message) {
    const p = document.createElement('p');
    p.textContent = `Message: ${obj.message}`;
    content.appendChild(p);
  }
  //@dan or austin this is not working because obj.users in undefined for some reason
  //i didn't have a chance to fix it but its just page text output
  console.dir(obj.users);
  if(obj.users) {
    const userList = document.createElement('p');
    const users = JSON.stringify(obj.users);
    userList.textContent = users;
    content.appendChild(userList);
  }
};
 
//function to handle our response
const handleResponse = (xhr,parseResponse) => {
  const content = document.querySelector('#output');
  
  //check the status code
  switch(xhr.status) {
    case 200: //success
      content.innerHTML = `<b>Success</b>`;
      break;
    case 201: //created
      content.innerHTML = '<b>Create</b>';
      break;
    case 204: //updated
      content.innerHTML = '<b>Updated (No Content)</b>';
      return;
    case 400: //bad request
      content.innerHTML = `<b>Bad Request</b>`;
      break;
    default: //any other status code
      content.innerHTML = `Error code not implemented by client.`;
      break;
  }

  //parse response 
  parseJSON(xhr, content);
  console.dir(xhr);

  if(parseResponse){
    const obj = JSON.parse(xhr.response);

    content.innerHTML += `<p>${obj}</p>`;
  }
  else{
    // content.innerHTML += `<p>meta Recived</p>`;
  }
  
};

//function to send our post request
const sendPost = (e, nameForm) => {
  e.preventDefault();
  
  const nameAction = nameForm.getAttribute('action');
  const nameMethod = nameForm.getAttribute('method');
  
  const nameField = nameForm.querySelector('#nameField');
  const ageField = nameForm.querySelector('#ageField');
  
  const xhr = new XMLHttpRequest();
  
  xhr.open(nameMethod, nameAction);
  
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader ('Accept', 'application/json');
  
  xhr.onload = () => handleResponse(xhr,false);
  
  const formData = `name=${nameField.value}&age=${ageField.value}`;
  
  //send our request with the data
  xhr.send(formData);

  //return false to prevent the browser from trying to change page
  return false;
};

const ghRequest = (e, userForm) => {
  console.dir("I AM IN ghRequest");
  e.preventDefault();
  const url = userForm.querySelector('#urlField').value;
  const method = userForm.querySelector('#methodSelect').value;
  
  
  const xhr = new XMLHttpRequest();
  console.dir("url: "+ url);
  console.dir("Method: "+ method);
  xhr.open(method,url);

  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Accept', 'application/json');
  
  if(method === 'GET' || method === 'get'){
    console.dir(xhr);
    xhr.onload = () => handleResponse(xhr, true);
  }
  if(method === 'HEAD'){
    xhr.onload = () => handleResponse(xhr, false);
  }
  xhr.send();
  
  console.dir("Now Leaving ghRequest");
  return false;
};

const init = () => {
  //grab form
  const nameForm = document.querySelector('#nameForm');
  const requestForm = document.querySelector('#requestForm');
  
  //create handler
  const addUser = (e) => sendPost(e, nameForm);
  const getUsers = (e) => ghRequest(e, requestForm);
  
  nameForm.addEventListener('submit', addUser);
  requestForm.addEventListener('submit', getUsers);
};

window.onload = init;

