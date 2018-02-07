var express = require('express');
var router = express.Router();
var client = require('../lib/redisclient');
var moment = require('moment');

const config = require('../config.js').get(process.env.NODE_ENV);

router.post('/', function(req, res, next) {
  const data = req.body
  try {
    const token = req.body.token
    if (token === config.token) {
      Object.keys(data).forEach(function (key) {
        if (key !== "token") {
          const timestamp = moment().unix();
          let value = data[key];
          client.sadd('timestamps', timestamp)
            .then(() => {})
            .catch((e) => console.log(e));
          client.set(key + ':' + timestamp, value)
            .then(() => {})
            .catch((e) => console.log(e));
        }
      });
      res.send('data arrived')
    } else {
      res.send('wrong token')
    }
  } catch(error) {
    res.send(error);
  }
});

module.exports = router;
