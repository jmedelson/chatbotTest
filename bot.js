const tmi = require('tmi.js');
var http = require("http");
var fs = require('fs')
var logger = fs.createWriteStream('log.txt', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})
// Define configuration options
const opts = {
  identity: {
    username: 'jdevtesting',
    password: 'oauth:tlelnrqad5h8duoiraeji86ysqdxkq'
    //https://twitchapps.com/tmi/
  },
  channels: [
    'jayemochi'
  ]
};

// Create a client with our options
const client = new tmi.client(opts);
// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();
const commandArray = ['!up', '!down', '!left', '!right'];
const mods = [
  'jayemochi'
]
var users = {};
var votes = {
  up:0,
  down:0,
  right:0,
  left:0
};
var voteCount = 0;
var settings = {
  chaos:false,
  resolution:2000,
  on: true,
  activeThreshold: 1
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
function simRound() {
  if(settings.chaos){
    let prob = getRandomInt(1,voteCount+1)
    console.log('Generating number between 1 and ' + voteCount +': ' + prob)
    prob = prob - votes['up']
    if(prob<=0){
      return('up')
    }
    prob = prob - votes['down']
    if(prob<=0){
      return('down')
    }
    prob = prob - votes['right']
    if(prob<=0){
      return('right')
    }else{
      return('left')
    }
  }else{
    //Democracy mode
    let max = Math.max(votes['up'],votes['down'],votes['right'],votes['left'])
    if(votes['up'] == max){
      return('up')
    }else if(votes['down'] == max){
      return('down')
    }else if(votes['right'] == max){
      return('right')
    }else {
      return('left')
    }
  }
}
function timeWrapper(){
  let result = simRound()
  console.log('Winner is: ', result)
  let data = JSON.stringify({
    'type' : 'votes',
    'result' : result,
    'count' : voteCount,
    'data': votes
  });
  //options for http request
  var options = {
    host: 'localhost',
    port: 8080,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
  };
  const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
    res.on('data', d => {
        process.stdout.write(d)
    })
  });
  req.write(data)
  votes = {
    up:0,
    down:0,
    right:0,
    left:0
  };
  voteCount = 0;
  console.log('counter reset!')
  
}
// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  // Remove whitespace from chat message
  const message = msg.trim();
  if(message.includes(context['username'])){
    if(message.includes('!off')){
      settings.on = false
      console.log('chatbot off')
    }else if(message.includes('!on')){
      settings.on = true
      console.log('chatbot on')
    }else if(message.includes('!resolution=')){
      let target = message.split('=');
      settings.resolution = parseInt(target[1])
      console.log('resolution changed to ', target[1])
    }else if(message.includes('!threshold=')){
      let target = message.split('=');
      settings.activeThreshold = parseInt(target[1])
      console.log('threshold changed to ', target[1])
    }else if(message.includes('!mode1')){
      settings.chaos = false
      console.log('mode changed to Democracy')
    }else if(message.includes('!mode2')){
      settings.chaos = true
      console.log('mode changed to Chaos')
    }else if(message.includes('!clear')){
      users = {}
      console.log('User list cleared')
    }
  }
  if(settings.on){
    //only logs if on
    logger.write('[' + context['tmi-sent-ts'] + '] ' + context['display-name'] + ' : ' + message + '\n')
    // If the command is known, let's execute it
    if (commandArray.some(v => message.includes(v))) {
      if(message.includes('!up')){
        votes['up'] += 1;
      }else if(message.includes('!down')){
        votes['down'] += 1;
      }else if(message.includes('!right')){
        votes['right'] += 1;
      }else if(message.includes('!left')){
        votes['left'] += 1;
      }
      voteCount += 1;
      if(voteCount==1){
        let mode = ''
        if(settings.chaos){
          mode = 'chaos'
        }else{
          mode = 'democracy'
        }
        console.log('Starting ' + mode + ' voting round with ' + settings.resolution + 'resolution' )
        setTimeout(timeWrapper, settings.resolution);
      }
      console.log(votes)
      //const num = rollDice(commandName);
      // client.say(target, `You entered !up command.`);
      // console.log(`* Executed !up command`);
      // console.log("full message:")
      // console.log(msg)
      // console.log("context:")
      // console.log(context)
    } else {
      console.log(`* Unknown command ${message}`);
    }
  }
  
}
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}