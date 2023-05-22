const e = require('express');
const connection = require('../config/connection');
const { Thought, User } = require('../models');
const { getRandomName, getRandomArrItem, appThoughts, appReactions } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // drops existing thoughts
  await Thought.deleteMany({});

  // drops existing users
  await User.deleteMany({});



// creates empty array to hold the users
const users = [];

//constructs user data object
const constructUserData = () => {
  const username = getRandomName();
  const email = `${username}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}@email.com`;
  const thoughts = [];
  let singleUser = { username, email, thoughts }
  return singleUser;
}

//checks user is unique within users
var currentUser;
const checkUniqueUser = () => {
  currentUser = constructUserData();
  users.forEach((el) => {
    if (el && currentUser.username === el.username) {
      checkUniqueUser();
    }
  });
  return currentUser;
}

// if unique, push into users array
const addUniqueUser = () => {
  let user = checkUniqueUser();
  users.push(user);
}

// initializes steps above x20 times, adding only unique users to array
for (let i = 0; i < 20; i++) {
  addUniqueUser();
}

// function to generate random thoughts to add to user object.
const getRandomThoughts = (int, passedInUser) => {
  const results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      thoughtText: getRandomArrItem(appThoughts),
      username: passedInUser,
    });
  }
  return results;
};

// creates empty array to hold thoughts
const thoughts = [];
users.forEach((el) => {
  if (el) {
    const thoughtsToPush = getRandomThoughts(2, el.username);
    thoughtsToPush.forEach((el) => {
      thoughts.push(el);
    });
  }
});

// function to generate random reactions to add to user object.
const getRandomReactions = (int) => {
  const results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      reactionBody: getRandomArrItem(appReactions),
      username: getRandomArrItem(users).username,
    });
  }
  return results;
};


// add users to collection and await the results
await User.collection.insertMany(users);

// add thoughts to the collection and await the results
await Thought.collection.insertMany(thoughts);

// logs the seed data on what should appear in the database
console.table(users);
console.table(thoughts);
console.info('Seeding complete! 🌱');
process.exit(0);
});
