const WebSocket = require('ws');
let ws = new WebSocket("wss://lhek8s2pxc.execute-api.us-east-2.amazonaws.com/dev?test=null");
let test = {action: "message", data: "THIS IS FROM ELASTIC BEANSTALK"}
function pingServer(){
    ws.send(JSON.stringify(test))
}
function closeServer(){
    ws.close();
}
ws.on('open', function open() {
    console.log('Websocket connected')
});
ws.on('message', function(evt) {
    let message = evt.toString()
    let parsed = JSON.parse(message)
    // console.log(`Client has sent us: ${parsed.data}`)
    console.log(parsed)
    if(parsed.action == 'message' && parsed.data == 'hello world'){
        pingServer()
    }
    
    console.log("received data over websocket")
    // console.log(received)

 });
 ws.on('close', function open() {
    console.log("websocket closed")
});