const express = require('express')
var bodyParser = require("body-parser");
const app = express()

app.listen(process.env.PORT || 3000)

app.use(express.static('website'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/index.html');
});

var fs = require('fs');
var database = JSON.parse(fs.readFileSync('./database.json', 'utf8'));


app.post('/login', function(req, res) {
  if(!database[req.query.username.toLowerCase()]){
    res.send("Not Found");
  }else{
    res.send(JSON.stringify(database[req.query.username.toLowerCase()]));
  }
});

app.post('/save', function(req, res) {
  database[req.query.username.toLowerCase()] = JSON.parse(req.body.data);
  fs.writeFile("./database.json", JSON.stringify(database), function(){});
  res.send("done")
});
