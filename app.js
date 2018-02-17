const express = require('express');
const path = require('path');
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const port = process.env.PORT || 8080;
server.listen(port);

console.log("socket.io connection started on port " + port)

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

app.use(express.static(path.join(__dirname, 'src/client/public')));

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname, 'src/client/public', 'index.html'))
})

app.get('/admin_panel_supernovamaniac', function(req, res){
  res.sendFile(path.resolve(__dirname, 'src/client/public', 'admin_panel_supernovamaniac.html'))
})

app.get('/request_list', function(req, res){
  res.sendFile(path.resolve(__dirname, 'src/client/public', 'request_list'))
})

app.get('*', function(req,res){
  res.status(404);
  res.send();
})

console.log("server started on port " + port)
