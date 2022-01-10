let ws = new WebSocket("ws://localhost:8081");
let selected = 5;
runVote()
setup()
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
function runVote(){
    for(let i = 1; i < 13; i++){
        let target = 'box-inner' + i;
        let ele = document.getElementById(target)
        if(i == selected){
            ele.style.color = 'limegreen'
            ele.style.borderColor = 'limegreen'
        }else{
            ele.style.color = 'white'
            ele.style.borderColor = 'white'
        }
    }
}
function reveal(){
    for(let i = 1; i < 13; i++){
        let target = 'box' + i;
        let ele = document.getElementById(target)
        ele.classList.add('show-card')
    }
}
function setup(){
    for(let i = 1; i < 13; i++){
        let target = 'boxValue' + i;
        let ele = document.getElementById(target)
        ele.innerText = '$' + getRandomIntInclusive(1,1000)
    }
}
function barControl(total, votes){
    // let max = votes[winner]
    // console.log(votes.up + "<>" + max)
    // console.log("winner: " + (votes.up/max)*100 + '%')
    document.getElementById('upCommandBar').style.width = (votes.up/total)*100 + '%'
    document.getElementById('downCommandBar').style.width = (votes.down/total)*100 + '%'
    document.getElementById('leftCommandBar').style.width = (votes.left/total)*100 + '%'
    document.getElementById('rightCommandBar').style.width = (votes.right/total)*100 + '%'
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function gridLogic(direction){
    let target = 'box-inner' + selected;
    if(direction == 'right'){
        if(selected%3 == 0){
            let ele = document.getElementById(target)
            ele.style.background = 'limegreen'
            ele.style.color = 'white'
            ele.style.borderColor = 'white'
            await sleep(200);
            ele.style.color = 'limegreen'
            ele.style.background = 'black'
            ele.style.borderColor = 'limegreen'
        }else{
            selected = selected + 1;
            runVote()
        }
    }else if(direction == 'left'){
        if((selected-1)%3 == 0){
            let ele = document.getElementById(target)
            ele.style.background = 'limegreen'
            ele.style.color = 'white'
            ele.style.borderColor = 'white'
            await sleep(200);
            ele.style.color = 'limegreen'
            ele.style.background = 'black'
            ele.style.borderColor = 'limegreen'
        }else{
            selected = selected - 1;
            runVote()
        }
    }else if(direction == 'up'){
        if(selected < 4){
            let ele = document.getElementById(target)
            ele.style.background = 'limegreen'
            ele.style.color = 'white'
            ele.style.borderColor = 'white'
            await sleep(200);
            ele.style.color = 'limegreen'
            ele.style.background = 'black'
            ele.style.borderColor = 'limegreen'
        }else{
            selected = selected - 3;
            runVote()
        }
    }else if(direction == 'down'){
        if(selected > 9){
            let ele = document.getElementById(target)
            ele.style.background = 'limegreen'
            ele.style.color = 'white'
            ele.style.borderColor = 'white'
            await sleep(200);
            ele.style.color = 'limegreen'
            ele.style.background = 'black'
            ele.style.borderColor = 'limegreen'
        }else{
            selected = selected + 3;
            runVote()
        }
    }
}
async function startRound(){
    let target = document.getElementById('timer')
    // let start = new Date().getTime();
    for(let i = 30; i>=0; i--){
        // console.log(new Date().getTime() - start)
        target.innerText = ':' + i
        await new Promise(r => setTimeout(r, 990));
    }
    document.getElementById('box' + selected).classList.add('show-card')
    for(let i = 13; i>=0; i--){
        target.style.visibility = (target.style.visibility == 'hidden' ? '' : 'hidden');
        await new Promise(r => setTimeout(r, 150));
    }
    reveal()
}
function pingServer(){
    ws.send('requesting vote')
}
ws.onopen = function() {
    console.log('Websocket connected')
    // ws.send("Browser Websocket Open");
}
ws.onmessage = function (evt) { 
    var received = evt.data;
    let parsed = JSON.parse(received)
    console.log(parsed)
    if(parsed.header == 'start'){
        startRound();
    }else if(parsed.header == 'vote'){
        let command = parsed.winner
        gridLogic(command)
        barControl(parsed.total, parsed.votes)
    }
    console.log("received data over websocket")
    console.log(received)

 };
 ws.onclose = function() { 
    console.log("websocket closed")
 };