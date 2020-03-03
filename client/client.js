let currentName;

const parseJSON = (xhr, content) => {
  //parse response (obj will be empty in a 204 updated)
  const obj = JSON.parse(xhr.response);
  //console.dir(obj);
  
  //if message in response, add to screen
  if(obj.message) {
    // const p = document.createElement('p');
    // p.textContent = `Message: ${obj.message}`;
    // content.appendChild(p);
  }

  //@dan or austin this is not working because obj.users in undefined for some reason
  //i didn't have a chance to fix it but its just page text output
  //console.dir(obj.users);
  if(obj.users) {
    const userList = document.createElement('p');
    const users = JSON.stringify(obj.users);
    userList.textContent = users;
    // content.appendChild(userList);
  }
};
 
//function to handle our response
const handleResponse = (xhr,parseResponse) => {
  const content = document.querySelector('#calender');
  
  //check the status code
  switch(xhr.status) {
    case 200: //success
      // content.innerHTML = `<b>Success</b>`;
      break;
    case 201: //created
      // content.innerHTML = '<b>Created</b>';
      break;
    case 204: //updated
      // content.innerHTML = '<b>Updated (No Content)</b>';
      return;
    case 400: //bad request
      // content.innerHTML = `<b>Bad Request</b>`;
      break;
    default: //any other status code
      content.innerHTML = `Error code not implemented by client.`;
      break;
  }

  //parse response 
  parseJSON(xhr);
  //console.dir(xhr);

  if(parseResponse){
    const obj = JSON.parse(xhr.response);
    let usersObjs = obj.users;
    let usersKeys = Object.keys(usersObjs.users);
    let userCount = Object.keys(obj)[0].length;

    // console.log(userCount);
    // console.dir(usersObjs.users);
    // console.dir(usersKeys);

    for (let i = 0; i < userCount ;i++) {
        
      // console.dir(usersKeys[i]);
      if(usersKeys[i] === currentName){
        let key = usersKeys[i];
        // console.dir('key: '+key);
        let userToList = usersObjs.users[''+key]
        // console.dir(userToList);
        if(userToList.username != 'username'){
          content.innerHTML += `<h2 class='dark fulllength-small'>${userToList.username}'s History</h2>`;
        }

        let dateKeys = Object.keys(userToList);
        let dateVals = Object.values(userToList);
        console.dir(dateKeys);
        console.dir(dateVals);
        for (let k = 0; k < dateKeys.length; k++) {
          let calBox = document.createElement('div');
          calBox.classList.add('calBox');
          calender.appendChild(calBox);
          if(dateKeys[k] != 'username' || dateVals[k] != userToList.username){
            const p = document.createElement('p');
            const moodPic = document.createElement('span');
            p.classList.add('dark');
            console.dir('current key ' + dateKeys[k]);
            console.dir('current val ' + dateVals[k]);
            p.textContent = `${dateKeys[k]}: `;
            switch(dateVals[k].mood){
              case "best":{
                moodPic.innerHTML= '<img src="/best.png" alt="medium mood">';
                break;
              }
              case "good":{
                moodPic.innerHTML= '<img src="/good.png" alt="medium mood">';
                break;
              }case "medium":{
                moodPic.innerHTML= '<img src="/medium.png" alt="medium mood">';
                break;
              }case "bad":{
                moodPic.innerHTML= '<img src="/bad.png" alt="medium mood">';
                break;
              }case "worst":{
                moodPic.innerHTML= '<img src="/worst.png" alt="medium mood">';
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
  // const ageField = nameForm.querySelector('#ageField');
  
  const xhr = new XMLHttpRequest();
  
  xhr.open(nameMethod, nameAction);
  
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader ('Accept', 'application/json');
  
  xhr.onload = () => handleResponse(xhr,false);
  
  const formData = `name=${nameField.value}`;//&age=${ageField.value}`;
  
  //send our request with the data
  xhr.send(formData);
  //return false to prevent the browser from trying to change page
  return false;
};


const sendPostMood = (e, in_form) => {
  e.preventDefault();
  
  const nameAction = in_form.getAttribute('action');
  const nameMethod = in_form.getAttribute('method');
  
  const moodField = document.querySelector('input[name="mood"]:checked');
  console.dir(moodField);
  
  const xhr = new XMLHttpRequest();
  
  xhr.open(nameMethod, nameAction);
  
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader ('Accept', 'application/json');
  
  xhr.onload = () => handleResponse(xhr,false);
  const formData = `mood=${moodField.value}`;//&age=${ageField.value}`;
  console.dir(formData);
  
  //send our request with the data
  xhr.send(formData);
  //return false to prevent the browser from trying to change page
  return false;
};
const ghRequest = (e) => {
  //console.dir("I AM IN ghRequest");
  // e.preventDefault();
  const url = '/getUsers';
  const method = "GET"//userForm.querySelector('#methodSelect').value;
  
  
  const xhr = new XMLHttpRequest();
  xhr.open(method,url);

  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  
  if(method === 'GET' || method === 'get'){
    //console.dir(xhr);
    xhr.onload = () => handleResponse(xhr, true);
  }
  if(method === 'HEAD'){
    xhr.onload = () => handleResponse(xhr, false);
  }
  xhr.send();
  
  //console.dir("Now Leaving ghRequest");
  return false;
};

const init = () => {
  //grab form
  const nameForm = document.querySelector('#nameForm');
  const moodgrid = document.querySelector('#moodgrid');
  const nametagbox = document.querySelector('#nametag-box');
  const nametag = document.querySelector('#nametag');
  let calender = document.querySelector('#calender');
  const currentDate = document.querySelector('#currentDate');

  //find a way to return this from the server
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '-' + dd + '-' + yyyy;
  currentDate.innerHTML = today;
  
  
  //create handler
  const addUser = (e) => {
    sendPost(e, nameForm);
    currentName = nameField.value;
    nameForm.style.display = "none";
    nametag.innerHTML  = `<b>Hi ${currentName}! How are you feeling?</b>`;
    moodgrid.style.opacity = 1;
    nametag.classList.add('typewrite');
    nametagbox.style.opacity = 1;
  };
  const addMood = (e) => {
    sendPostMood(e, moodgrid);
    let data = getUsers();
    moodgrid.style.display = "none";
    calender.style.opacity= 1;


  };
  const getUsers = (e) => ghRequest(e);
  
  nameForm.addEventListener('submit', addUser);
  moodgrid.addEventListener('submit', addMood);
  // requestForm.addEventListener('submit', getUsers);
};

window.onload = init;

