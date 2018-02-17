var express = require('express');
var router = express.Router();
var client = require('../lib/redisclient');
var moment = require('moment');

const config = require('../config.js').get(process.env.NODE_ENV);

function toggleLights(amUp=5, amDown=6, pmUp=19, pmDown=22){
  let currentTime = moment().format("H");
  return (currentTime >= pmUp && currentTime <= pmDown) || ( currentTime >= amUp && currentTime <= amDown);
}
router.post('/', function(req, res, next) {
  const timestamp = moment().unix();
  const data = req.body;
  try {
    Object.keys(data).forEach(function (key) {
      let value = data[key];
      console.log(key, value, timestamp);
      client.sadd('timestamps', timestamp)
        .then(() => {})
        .catch((e) => console.log(e));
      client.set(key + ':' + timestamp, value)
        .then(() => {})
        .catch((e) => console.log(e));
    });
    client.set('ledsOn:' + timestamp, toggleLights())

    res.send(`{"data Arrived" : true,\n"ledOn": ${toggleLights()}}`)

  } catch(error) {
    res.send(error);
  }
});

module.exports = router;
