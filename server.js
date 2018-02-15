var app = require('http').createServer();
var io = require('socket.io')(app);
app.listen(80);

var message = "HELLO"
var queue = []

io.on('connection', function(socket){ //this is when new user connects
  var initial_object = {
    "queue": queue,
    "success": true,
    "message": ""
  }
  socket.emit('request_update', initial_object);
  console.log("User connected")

  socket.on('user_input',function(name){
    console.log('received')
    io.sockets.emit('name_return','Hello, your name is ' + name);
  });

  socket.on('clear', function(){
    queue = [];
    var obj = {
      "queue": queue,
      "success": true,
      "message": "removed everything"
    }
    io.sockets.emit('request_update', obj);
  })

  socket.on('song_request', function(id){
    queue.push(id)
    var obj = {
      "queue": queue,
      "success": true,
      "message": ""
    }
    console.log(queue)
    io.sockets.emit('request_update', obj);
  })

});
