const WebSocketServer = require('ws');
const wss = new WebSocketServer.Server({ port: 8081 })
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
wss.on("connection", ws => {
    console.log("new client connected");
    // console.log("Broadcasting in 2 seconds")
    // setTimeout(webSocketBroadcast, 2000);
    // sending message
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
        simRound();
    });
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has disconnected");
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});
function simRound(){
    console.log('Round Starting!')
    wss.clients.forEach(function each(client) {
        console.log('client detected')
        if (client.readyState === WebSocketServer.OPEN) {
            let message = {
                header: 'start'
            }
            client.send(JSON.stringify(message));
            console.log('Starting')
            const intervalObj = setInterval(() => {
                let commands = ['right', 'left', 'up', 'down']
                let  randomElement = commands[Math.floor(Math.random() * commands.length)];
                let data = {
                    up:getRandomIntInclusive(1,500),
                    down:getRandomIntInclusive(1,500),
                    right:getRandomIntInclusive(1,500),
                    left:getRandomIntInclusive(1,500)
                }
                let sum = data.up + data.down + data.left + data.right
                let message = {
                    header: 'vote',
                    winner: randomElement,
                    votes:data,
                    total:sum
                }
                client.send(JSON.stringify(message));
                console.log('vote sent')
            }, 2000);
            const timeoutObj = setTimeout(() => {
                clearInterval(intervalObj);
                console.log('Round Ended');
            }, 30100);
        }
    });
    
}

function webSocketBroadcast(){
    console.log('Broadcasting!')
    wss.clients.forEach(function each(client) {
        console.log('client detected')
        // console.log(client !== ws)
        console.log(client.readyState)
        console.log(client.readyState === WebSocketServer.OPEN)
        let commands = ['right', 'left', 'up', 'down']
        let  randomElement = commands[Math.floor(Math.random() * commands.length)];
        let data = {
            up:getRandomIntInclusive(1,500),
            down:getRandomIntInclusive(1,500),
            right:getRandomIntInclusive(1,500),
            left:getRandomIntInclusive(1,500)
        }
        let sum = data.up + data.down + data.left + data.right
        if (client.readyState === WebSocketServer.OPEN) {
            let message = {
                header: 'vote',
                winner: randomElement,
                votes:data,
                total:sum
            }
          client.send(JSON.stringify(message));
          console.log('sent')
        }
    });
}

console.log("The WebSocket server is running on port 8081");