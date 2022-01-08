var http = require("http");
console.log('Server Starting, Listening on port 8080')
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('POST Data Received!');
    console.log('req received-')
    // console.log(req)
    var body = "";
    req.on('data', function (chunk) {
      body += chunk;
      // console.log(chunk.toString())
    });
    req.on('end', function () {
      console.log('POSTed: ' + body);
      // res.writeHead(200);
      // res.end(postHTML);
    });
    res.end();
  }).listen(8080);