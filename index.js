const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
  token: 'xoxb-1160973993026-1154923438406-jWrA84TyqEq4QonpRyItl2b4',
  name: 'task_update_bot'
});

const OHAYO = 'Ohayo';
const YES = 'YES';
const POST = 'POST';

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

  postToChannel('general', 'task_update_bot started...!!!');
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
    postToUser(user.name, `Hello ${user.real_name} it\'s time to send the task update, ready? \n Type \'YES\' or \'NO\'`);
  } else if (data.text.includes(YES)) {
    let user = getUser(data);
    let task = {user_id: user.id, yesterday: -1, today: -1, blocker: -1};
    tasks.push(task);
    postToUser(user.name, `What did you do previous working day?`);
  } else if (data.text.includes(POST)) {
    console.log('POST');
    let user = getUser(data);
    let task = getUserTask(data);
    console.log(task);
    // tasks.splice(task);
    postToChannel('huubap_task_update', task);
  } else if (getUserTask(data)) {
    let user = getUser(data);
    let task = getUserTask(data);
    if (task.yesterday === -1) {
      task.yesterday = data.text;
      postToUser(user.name, `What do you do today?`);
    } else if (task.today === -1) {
      task.today = data.text;
      postToUser(user.name, `Any blockers?`);
    } else if (task.blocker === -1) {
      task.blocker = data.text;
      postToUser(user.name, `Thanks for your status, here is the summary`);
      postToUser(user.name, `Summary`);
      postToUser(user.name, `Post to channel \n Type \'POST\'`);
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
