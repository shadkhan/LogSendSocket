// Creating Simple server to test client 
var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  parser = new require('xml2json'),
  fs = require('fs');

// creating the server ( localhost:8030 )
app.listen(8030);

console.log('server listening on localhost:8030');

// on server started we can load our tpl.html page
function handler(req, res) {
  fs.readFile(__dirname + '/tpl.html', function(err, data) {
    if (err) {
      console.log(err);
      res.writeHead(500);
      return res.end('Error loading tpl.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

// creating a new websocket to keep the content updated without REST call
io.sockets.on('connection', function(socket) {
  console.log(__dirname);
  // watching the xml file
  fs.watchFile(__dirname + '/log4js.xml', function(curr, prev) {
    // on file change we can read the new xml
    fs.readFile(__dirname + '/log4js.xml', function(err, data) {
      if (err) throw err;
      // parsing the new xml data and converting them into json file
      var json = parser.toJson(data);
      // send the new data to the client
      socket.volatile.emit('notification', json);
    });
  });

});

/** Here you can add your email send services 
*  
*
var mandrill = require('node-mandrill')('####API_KEY####'); 

function sendEmail ( _name, _email, _subject, _message) {
    mandrill('/messages/send', {
        message: {
            to: [{email: _email , name: _name}],
            from_email: 'shadab@example.com',
            subject: _subject,
            text: _message
        }
    }, function(error, response){
        if (error) console.log( error );
        else console.log(response);
    });
}

// define your own email api which points to your server. this can be call from client SendMail function or directly push from socket as broadcast message.

app.post( '/api/sendemail/', function(req, res){

    var _name = req.body.name;
    var _email = req.body.email;
    var _subject = req.body.subject;
    var _messsage = req.body.message;

    //implement your spam protection or checks. 

    sendEmail ( _name, _email, _subject, _message );

});
*/