var app = require('http').createServer();
var io = require('socket.io')(app);
const port = process.env.PORT || 80;
app.listen(port);

console.log("socket.io connection started on port " + port)

var message = "HELLO"
var queue = []

io.on('connection', function(socket){ //this is when new user connects
  var initial_object = {
    "queue": queue,
    "success": true,
    "message": ""
  }
  console.log("Connection made")
  socket.emit('request_update', initial_object);

  socket.on('clear', function(){
    queue = [];
    var obj = {
      "queue": queue,
      "success": true,
      "message": "removed everything"
    }
    io.sockets.emit('request_update', obj);
  })

  socket.on('request_remove', function(id){
    var index = queue.indexOf(id);
    if(index > -1){
      queue.splice(index, 1)
    }
    var obj = {
      "queue": queue,
      "success": true,
      "message": ""
    }
    console.log(queue)
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

  socket.on('disconnect', function(){
    console.log("User disconnected");
  })

});
