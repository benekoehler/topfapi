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
    const token = req.body.token
    if (token === config.token) {
      Object.keys(data).forEach(function (key) {
        if (key !== "token") {
          let value = data[key];
          client.sadd('timestamps', timestamp)
            .then(() => {})
            .catch((e) => console.log(e));
          client.set(key + ':' + timestamp, value)
            .then(() => {})
            .catch((e) => console.log(e));
        }
      });
      client.set('ledsOn:' + timestamp, toggleLights())
      console.log(toggleLights());
      res.send(`{"data Arrived" : true,\n"ledOn": ${toggleLights()}}`
        )
    } else {
      res.send('{"data Arrived": false }')
    }
  } catch(error) {
    res.send(error);
  }
});

module.exports = router;
