let ws = new WebSocket("wss://lhek8s2pxc.execute-api.us-east-2.amazonaws.com/dev?app=helper");
function pingServer(){
    ws.send('requesting vote')
}
ws.onopen = function(evt) {
    console.log('Websocket connected')
    // ws.send("Browser Websocket Open");
}
ws.onmessage = function (evt) { 
    console.log("received data over websocket")
    console.log(received)
    var received = evt.data;
    let parsed = JSON.parse(received)
    console.log(parsed)

 };
 ws.onclose = function() { 
    console.log("websocket closed")
 };