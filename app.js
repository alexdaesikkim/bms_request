const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname + 'src/client/public'));

app.get('*', function(req, res){
  res.sendFile(path.resolve(__dirname, 'src/client/public', 'index.html'))
})

app.listen(port);
console.log("server started on port " + port)
