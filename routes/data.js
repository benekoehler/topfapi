var express = require('express');
var router = express.Router();
var client = require('../lib/redisclient');
var moment = require('moment');

router.post('/', function(req, res, next) {
  console.log(req.body);
  const data = req.body
  Object.keys(data).forEach(function (key) {
    const timestamp = moment().unix();
    let value = data[key];
    client.sadd('timestamps', timestamp)
      .then(() => {})
      .catch((e) => console.log(e));
    client.set(key + ':' + timestamp, value)
      .then(() => {})
      .catch((e) => console.log(e));
  });
  res.send('data arrived')
});

module.exports = router;
