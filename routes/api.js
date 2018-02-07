var express = require('express');
var router = express.Router();
var client = require('../lib/redisclient');
var moment = require('moment');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3332");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

router.get('/', function(req, res, next) {
  async function getData() {
    let timestamps = await client.smembers('timestamps');
    let tempArray = [];
    for (let timestamp of timestamps) {
      let temp = await client.get('temp:' + timestamp)
      tempArray.push({ [timestamp]: temp });
    }
    return tempArray;
  }
  getData()
    .then((data) => {
      res.send(data)
    });
});

module.exports = router;
