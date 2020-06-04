const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
  token: 'xoxb-1160973993026-1154923438406-41KrIJ0Uy7l1v3pEZ4ygTUbj',
  name: 'task_update_bot'
});

const OHAYO = 'Ohayo';
const YES = 'YES';
const POST = 'POST';

const CHANNEL_GENERAL = 'general';
const CHANNEL_TASK_UPDATE = 'huubap_task_update';

const MSG_1 = 'Hello';
const MSG_2 = ', are you ready to send your task update? Type \'YES\' or \'NO\'';
const MSG_3 = 'What task have you done on previous working day?';
const MSG_4 = 'What task will you take on today?';
const MSG_5 = 'Any blockers/roadblocks?';
const MSG_6 = 'Thanks for the input, below is the summary:';
const MSG_7 = 'Type \'POST\' to complete task update.';

let channels = [];
let users = [];
let tasks = [];

// Start Handler
bot.on('start', () => {

  bot.getChannels().then(result => {
    console.log('Channels...!!!');
    channels = result;
  });

  bot.getUsers().then(result => {
    console.log('Users...!!!');
    users = result.members;
  });

  postToChannel(CHANNEL_GENERAL, 'task_update_bot started...!!!');
});

// Error Handler
bot.on('error', err => console.log(err));

// Open connection
bot.on('open', () => console.log('Socket Opened...!!!'));

// Close connection
bot.on('close', () => console.log('Socket Closed...!!!'));

// Message Handler
bot.on('message', data => {
  console.log(data);
  if (data.type !== 'message') {
    return;
  }

  handleMessage(data);
});

// Respons to Data
function handleMessage(data) {
  if (!data)
    return;
   if (data.text.includes(OHAYO)) {
    let user = getUser(data);
    let task = getUserTask(data);
    if(task){
      task.yesterday = -1;
      task.today = -1;
      task.blocker = -1;
    }
    postToUser(user.name, `${MSG_1} ${user.real_name} ${MSG_2}`);
  } else if (data.text.includes(YES)) {
    let user = getUser(data);
    let task = {user_id: user.id, yesterday: -1, today: -1, blocker: -1};
    tasks.push(task);
    postToUser(user.name, MSG_3);
  } else if (data.text.includes(POST)) {
    console.log('POST');
    let user = getUser(data);
    let task = getUserTask(data);
    console.log(task);
    // tasks.splice(task);
    postToChannel(CHANNEL_TASK_UPDATE, task);
  } else if (getUserTask(data)) {
    let user = getUser(data);
    let task = getUserTask(data);
    if (task.yesterday === -1) {
      task.yesterday = data.text;
      postToUser(user.name, MSG_4);
    } else if (task.today === -1) {
      task.today = data.text;
      postToUser(user.name, MSG_5);
    } else if (task.blocker === -1) {
      task.blocker = data.text;
      postToUser(user.name, MSG_6);
      postToUser(user.name, `Summary`);
      postToUser(user.name, MSG_7);
    }
  }
}

function getUser(data) {
  return users.find(item => item.id === data.user);
}

function getUserTask(data) {
  return tasks.find(item => item.user_id === data.user);
}

function postToUser(userChannel, message) {
  const params = {
    icon_emoji: ':laughing:'
  };
  bot.postMessageToUser(userChannel, message, params);
}

function postToChannel(channel, message) {
  const params = {
    icon_emoji: ':laughing:'
  };
  bot.postMessageToChannel(channel, message, params);
}

// Show Help Text
function runHelp() {
  const params = {
    icon_emoji: ':question:'
  };

  bot.postMessageToChannel(
      'general',
      `Type $jokebot with either 'chucknorris', 'yomama' or 'random' to get a joke`,
      params
  );
}
