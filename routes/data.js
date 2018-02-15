var express = require('express');
var router = express.Router();
var client = require('../lib/redisclient');
var moment = require('moment');

const config = require('../config.js').get(process.env.NODE_ENV);

router.post('/', function(req, res, next) {
  function toggleLights(amUp=5, amDown=6, pmUp=19, pmDown=22){
    let currentTime = moment().format("H");
    return (currentTime >= pmUp && currentTime <= pmDown) || ( currentTime >= amUp && currentTime <= amDown);
  }
  const timestamp = moment().unix();
  const data = req.body

  try {
    Object.keys(data).forEach(function (key) {
      let value = data[key];
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
