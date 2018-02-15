var express = require('express');
var router = express.Router();
var client = require('../lib/redisclient');
var moment = require('moment');


//use this Middleware, Access-control
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
    let humArray = [];
    let moist1Array = [];
    let moist2Array = [];
    let lightArray = [];
    let ledArray = [];

    for (let timestamp of timestamps) {
      let temp = await client.get('temp:' + timestamp);
      let hum = await client.get('hum:' + timestamp);
      let moist1 = await client.get('moist1:' + timestamp);
      let moist2 = await client.get('moist2:' + timestamp);
      let light = await client.get('light:' + timestamp);
      let led = await client.get('ledsOn:' + timestamp);
      tempArray.push({ [timestamp]: temp });
      humArray.push({ [timestamp]: hum });
      moist1Array.push({ [timestamp]: moist1 });
      moist2Array.push({ [timestamp]: moist2 });
      lightArray.push({ [timestamp]: light });
      ledArray.push({ [timestamp]: led });
    }


    return [
            {
              "type": "temp",
              "value": tempArray
            },
            {
              "type": "hum",
              "value": humArray
            },
            {
              "type": "moist1",
              "value": moist1Array
            },
            {
              "type": "moist2",
              "value": moist2Array
            },
            {
              "type": "light",
              "value": lightArray
            },
            {
              "type": "ledOn",
              "value": ledArray
            }
          ];
  };
  getData()
    .then((data) => {
      res.send(data)
    });
});

module.exports = router;
