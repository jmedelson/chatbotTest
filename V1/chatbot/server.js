const tmi = require('tmi.js');
var http = require("http");
var fs = require('fs')
var logger = fs.createWriteStream('log.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
})
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
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
// Connect to Twitch:
client.connect();
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}