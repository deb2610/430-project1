
const firebaseAdmin = require('firebase-admin');
const fbServiceAccount = require('./firebase.json');

console.dir('FIREBASE INIT');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(fbServiceAccount),
  databaseURL: 'https://project1-f4ffd.firebaseio.com',
});
/* firebase */
const firebase = firebaseAdmin.database();
let users;
let usersOut;
/* INITS FINISHED */

/* Funcitons */
const getUserData = async () => {
  try {
    const snapshot = await firebase.ref('/').once('value');
    users = snapshot.val();
    // console.dir("[2] USER OBJECT: ");
    // console.dir(users);
    usersOut = JSON.stringify(users);
    // console.dir('[3] STRINGIFIED: ');
    // console.dir(usersOut);
    // console.dir("[4] RETURNING USERS");
    return usersOut;
  } catch (err) {
    return err;
  }
};
const writeUserData = async (userId, name, date, mood) => {
  await getUserData().catch();
  const data = JSON.parse(usersOut);

  const userCount = Object.keys(data)[0].length;
  console.dir(userCount);

  for (const prop in data.users) {
    if (userId === prop) {
      console.dir(`${prop} is a match!`);

      for (let children in prop) { // children dates in 'Olive'
        if (children === date) {
          children.mood = mood;
        } else if (children === prop) {
          children = name;
        } else {
          firebase.ref(`users/${userId}/${date}`).set({
            mood,
          });
        }
      }

      return;
    }

    console.dir('nope');
  }
  firebase.ref(`users/${userId}`).set({
    username: name,
  });
  firebase.ref(`users/${userId}/${date}`).set({
    mood,
  });
};

module.exports = {
  writeUserData,
  getUserData,
};
