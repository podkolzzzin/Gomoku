/**
 * Created by podko_000 on 17.01.15.
 */

var fs = require('fs');
//var crypto = require("crypto");
//var cData = {
//    cert: fs.readFileSync("/var/server.crt").toString(),
//    key: fs.readFileSync("/var/private.key").toString()
//};

//var cred = crypto.createCredentials(cData);
var app = require('http').createServer();
//app.setSecure(cred);
var io = require('socket.io')(app);

app.listen(8080);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

require("./server.js").bind(io);