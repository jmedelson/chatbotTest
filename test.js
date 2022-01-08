var http = require("http");
const data = JSON.stringify({
    'type' : 'Command',
    'data' : 'Up'
});
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
req.on('error', error => {
    console.error(error)
})
req.write(data)
req.end()