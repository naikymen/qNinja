"use strict";
const qpcr = require("../../../qpcr/ninjaqpcr");
const websocket_server = require('../../core_modules/websocket-server.js');

class ExperimentCtrl {
  constructor  () {
  }
  stop (){
    qpcr.setEventReceiver(null);
  }
  start () {
    qpcr.setEventReceiver(this);
    const protocol = {
      lidTemp: 110,
      cycles: [
        {
          repeat: 1,
          steps: [
            { type:"initial denaturation", temp:94.0, duration:15.0 }
          ]
        },
        {
          repeat: 30,
          steps: [
            { type:"denaturation", temp:94.0, duration:15.0 },
            { type:"annealing", temp:55.0, duration:15.0 },
            { type:"extension", temp:72.0, duration:15.0 }
          ]
        },
        {
          repat: 1,
          steps: [
            { type:"final extension", temp:72.0, duration:30.0 }
          ]
        }
      ]
    };
    qpcr.start(protocol);
  }
  /* Callback functions */
  onThermalTransition (data) {
    data.topic = 'ThermalTransition';
    data.code = 200;
    console.log("onThermalTransition");
    console.log(data);
    websocket_server.broadcast('experiment', data);
  }
  onThermalDataUpdate (data) {
    data.topic = 'ThermalDataUpdate';
    data.code = 200;
    console.log("onThermalDataUpdate");
    console.log(data);
    websocket_server.broadcast(data);
    websocket_server.broadcast('experiment', data);
  }
  onFluorescenceDataUpdate (data) {
    data.topic = 'FluorescenceDataUpdate';
    data.code = 200;
    console.log("onFluorescenceDataUpdate");
    console.log(data);
    websocket_server.broadcast(data);
    websocket_server.broadcast('experiment', data);
  }
}

module.exports = new ExperimentCtrl();