var DATA_DIR = './pi/'
var express = require('express');
var fs = require('fs');
var ga = require('node-ga');

var app = express();

app.use(ga('UA-686690-27', {
    safe: false
}));

app.get('/pi', function (req, res) {
  var index = req.param('from') || 0;
  index = parseInt(index);

  var count = req.param('digits') || 1000;
  count = parseInt(count);

  if (count > 100000) {
    count = 100000;
  }

  var pi = '';

  var file1 = index / 100000 | 0;
  var f1 = fs.readFileSync(DATA_DIR + file1 + '.pi');
  var delta1 = index % 100000;
  var length = count;
  if (length + delta1 > 100000) {
    length = 100000 - delta1;
  }
  pi += f1.slice(index, index + length)
  
  if (length + delta1 > 100000) { 
    var f2 = fs.readFileSync(DATA_DIR + (file1 + 1) + '.pi');
    var l2 = count = length;
   pi += f2.slice(0, l2)
  }
  if (req.param('json')) {
    res.json({num : pi, digits : count, from : index});
  }
  else if (req.param('jsonp')) {
    res.send(';' + req.param('jsonp') + '(' + JSON.stringify({num : pi, digits : count, from : index}) + ');');
  }
  else {
    res.send(pi)
  }

});

app.use(express.static('./public'));

app.listen(1337);
