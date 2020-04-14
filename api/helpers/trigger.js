const { pope } = require("pope");
var http = require("request-promise");
module.exports = {
  friendlyName: "Trigger",

  description: "Trigger is the event listener for new updates using polling",

  inputs: {
    peer: {
      type: "json",
      example: "{}",
      description: "The peer of a specific user",
      required: true
    },
    testFlag: {
      type: "boolean",
      example: false,
      description: "Send test data",
      required: true
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    try {
      let peer = inputs.peer;
      let trigger = await Trigger.findOne({
        id: peer.peerTrigger
      });
      if (!trigger) {
        throw "No Trigger Found in This Peer";
      }

      let token = await Token.findOne({
        id: peer.triggerToken
      });

      if (!token) {
        throw "No Trigger Token Found in This Peer";
      }
      let option = {};
      option.headers = Object();
      option.uri = pope(trigger.url, token.value);
      option.json = true;
      option.method = "GET";
      let authentication = await Authentication.findOne({
        application: peer.peerTriggerApplication
      });
      if (authentication) {
        if (authentication.authPlacement == "header") {
          option.headers[authentication["mapping"]["key"]] = pope(
            authentication["mapping"]["value"],
            token.value
          );
          // option.headers;
        } else {
          option.qs = Object();
          option.qs[authentication["mapping"]["key"]] = pope(
            authentication["mapping"]["value"],
            token.value
          );
        }
      }
      option.headers["User-Agent"] = "Webpeer-Syncer";
      option.headers["Accept"] = "application/json";
      let data = await http(option);
      let response = Array();
      if (Array.isArray(data)) {
        response = data;
      } else if (data.hasOwnProperty("data") && Array.isArray(data.data)) {
        response = data.data;
      } else if (
        data.hasOwnProperty("response") &&
        Array.isArray(data.response)
      ) {
        response = data.response;
      } else {
        for (i in data) {
          if (Array.isArray(data[i])) {
            response = data[i];
            break;
          }
        }
      }
      if (!response.length) {
        throw "There is no entry coming from the API, Make sure you have atleast one entry in the application";
      } else if (!response[0].hasOwnProperty("id")) {
        throw "Trigger expects the API to return a unique id with the key 'id', which we can not find in the response. please make sure to send it";
      }
      let actual = Array();

      let lastId = peer.peerProcessedId;
      if (lastId != "") {
        for (e in response) {
          if (response[e].id == lastId) {
            break;
          }
          actual.push(response[e]);
        }
        if (actual.length == 0 && inputs.testFlag == true) {
          actual.push(response[0]);
        }
      } else {
        actual.push(response[0]);
      }

      return exits.success(actual);
    } catch (err) {
      if (err.name == "StatusCodeError") {
        err = err.message;
      }
      return exits.error(err);
    }
  }
};
