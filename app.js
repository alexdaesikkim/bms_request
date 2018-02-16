const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

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

app.listen(port);
console.log("server started on port " + port)
