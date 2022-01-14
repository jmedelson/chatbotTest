let ws = new WebSocket("wss://lhek8s2pxc.execute-api.us-east-2.amazonaws.com/dev?test=null");
let test = {action: "message", data: "hello world"}
function pingServer(){
    ws.send(JSON.stringify(test))
}
function closeServer(){
    ws.close();
}
ws.onopen = function() {
    console.log('Websocket connected')
    // ws.send("Browser Websocket Open");
}
ws.onmessage = function (evt) { 
    var received = evt.data;
    let parsed = JSON.parse(received)
    console.log(parsed)
    if(parsed.action == 'message' && parsed.data == 'hello world'){
        console.log("MESSAGE RECEIVED")
    }
    console.log("received data over websocket")
    // console.log(received)

 };
 ws.onclose = function() { 
    console.log("websocket closed")
 };