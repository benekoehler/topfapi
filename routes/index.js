var express = require('express');
var router = express.Router();
var client = require('../lib/redisclient');
var moment = require('moment');

/* GET home page. */
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
      res.render('index', {
        title: 'Express',
        data: JSON.stringify(data),
      });
    });

});

module.exports = router;
