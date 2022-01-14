let ws = new WebSocket("wss://lhek8s2pxc.execute-api.us-east-2.amazonaws.com/dev?app=game");

let timerValue = 30
let selected = 5
reset();
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
function reset(){
    selected = 5;
    runVote()
    setup()
    for(let i = 1; i < 13; i++){
        let target = 'box' + i;
        let ele = document.getElementById(target)
        ele.classList.remove('show-card')
    }
    let timer = document.getElementById('timer')
    timer.innerText = ':' + timerValue
    let up = document.getElementById('upCommandBar')
    let down = document.getElementById('downCommandBar')
    let left = document.getElementById('leftCommandBar')
    let right = document.getElementById('rightCommandBar')
    let elements = [up,down,left,right]
    for(let i = 0; i<=3;i++){
        elements[i].style.background = 'limegreen'
        elements[i].style.width = '10%'
    }
}
function barAnimate(winner, votes){
    let up = document.getElementById('upCommandBar')
    let down = document.getElementById('downCommandBar')
    let left = document.getElementById('leftCommandBar')
    let right = document.getElementById('rightCommandBar')
    let elements = [up,down,left,right]
    for(let i = 0; i<=3;i++){
        elements[i].style.background = 'limegreen'
    }
    let widths = [up.style.width,down.style.width,left.style.width,right.style.width]
    let ends = [(votes.up/votes[winner])*100, (votes.down/votes[winner])*100, (votes.left/votes[winner])*100,(votes.right/votes[winner])*100]
    let differential = [ends[0]-parseFloat(widths[0]),ends[1]-parseFloat(widths[1]),ends[2]-parseFloat(widths[2]),ends[3]-parseFloat(widths[3])]
    let counter = 0
    // for(let i = 0; i<=3;i++){
    //     let width = elements[i].style.width
    //     let start = parseFloat(width)
    //     console.log(differential[i])
    //     console.log(differential[i]/10)
    //     let end = (start + (differential[i]/10))+'%'
    //     console.log(end)
    //     elements[i].style.width = end
    // }
    let myInterval = setInterval(function(){
        for(let i = 0; i<=3;i++){
            let start = parseFloat(elements[i].style.width)
            let end = (start + (differential[i]/50))+'%'
            elements[i].style.width = end
        }
        counter++
        // console.log(counter)
        if(counter>=50){
            // console.log("clearing")
            clearInterval(myInterval)
            let target = winner + 'CommandBar'
            document.getElementById(target).style.background = 'red'
        }
    },20)
}
function barControl(winner, votes){
    barAnimate(winner,votes)
    // let max = votes[winner]
    // console.log(votes.up + "<>" + max)
    // console.log("winner: " + (votes.up/max)*100 + '%')
    // document.getElementById('upCommandBar').style.width = (votes.up/votes[winner])*100 + '%'
    // document.getElementById('downCommandBar').style.width = (votes.down/votes[winner])*100 + '%'
    // document.getElementById('leftCommandBar').style.width = (votes.left/votes[winner])*100 + '%'
    // document.getElementById('rightCommandBar').style.width = (votes.right/votes[winner])*100 + '%'
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
    for(let i = timerValue; i>=0; i--){
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
    if(parsed.header == 'startGrid'){
        startRound();
    }else if(parsed.header == 'vote'){
        let command = parsed.winner
        gridLogic(command)
        barControl(command, parsed.votes)
    }
    console.log("received data over websocket")
    console.log(received)

 };
 ws.onclose = function() { 
    console.log("websocket closed")
 };