const express = require('express');
const path = require('path');
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const redis_url = process.env.REDIS_URL || '';

console.log(redis_url)
console.log("trying to connect?")

var client = require('redis').createClient(redis_url);

const port = process.env.PORT || 8080;
server.listen(port);

console.log("socket.io connection started on port " + port)

io.on('connection', function(socket){ //this is when new user connects
  var init_queue = []
  client.lrange('queue', 0, -1, function(err, reply){
    init_queue = reply;
    console.log(reply);
    var initial_object = {
      "queue": init_queue,
      "success": true,
      "message": ""
    }
    console.log("Connection made")
    socket.emit('request_update', initial_object);
  })

  socket.on('clear', function(){
    client.del('queue', function(err, reply){
      var obj = {
        "queue": [],
        "success": true,
        "message": "removed everything"
      }
      io.sockets.emit('request_update', obj);
    })
  })

  socket.on('request_remove', function(id){
    var str_id = id.toString();
    client.lrem('queue', 1, str_id, function(err, reply){
      client.lrange('queue', 0, -1, function(err, reply){
        console.log(reply);
        console.log("updating");
        var obj = {
          "queue": reply,
          "success": true,
          "message": ""
        }
        console.log(reply)
        io.sockets.emit('request_update', obj);
      })
    })
  })

  socket.on('song_request', function(id){
    client.rpush('queue', id, function(err, reply){
      client.lrange('queue', 0, -1, function(err, reply){
        var obj = {
          "queue": reply,
          "success": true,
          "message": ""
        }
        console.log(reply);
        io.sockets.emit('request_update', obj);
      })
    })
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
