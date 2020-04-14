const { pope } = require("pope");
var http = require("request-promise");
const baseURL = sails.config.custom.baseUrl;

module.exports = {
  friendlyName: "Action",

  description: "Action something.",

  inputs: {
    peer: {
      type: "json",
      example: "{}",
      description: "The peer of a specific user",
      required: true
    },
    data: {
      type: "json",
      example: "[]",
      description: "Data to send",
      required: true
    }
  },

  exits: {},

  fn: async function(inputs, exits) {
    let peer = inputs.peer;
    let data = inputs.data;
    try {
      let action = await Action.findOne({
        id: peer.peerAction
      });
      if (!action) {
        throw "No Trigger Found in This Peer";
      }

      let token = await Token.findOne({
        id: peer.actionToken
      });

      if (!token) {
        throw "No Trigger Token Found in This Peer";
      }
      let option = {};
      option.headers = Object();
      option.uri = pope(action.url, token.value);
      option.json = true;
      option.method = "POST";
      let authentication = await Authentication.findOne({
        application: peer.peerActionApplication
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
      let action_fields = action.fields;
      let peer_response = peer.actionMapping;
      // let data = await http(option);
      action_fields.forEach(a => {
        a.value = "";
        peer_response.forEach(z => {
          if (a.key == z.key) {
            a.value = z.value;
          }
        });
      });
      let response = Array();
      data.reverse();
      for (element in data) {
        var post = Object();
        action_fields.forEach(a => {
          set_mapping_arr(a.key, pope(a.value, data[element]), post);
        });
        option.body = post;
        option.headers["User-Agent"] = "Webpeer-Syncer";
        option.headers["Accept"] = "application/json";

        response.push(await http(option));
        await Peer.update({
          id: peer.id
        }).set({
          peerProcessedId: data[element].id
        });
      }
      return exits.success(response);
    } catch (err) {
      console.log("Action Err", err);
      if (err.name == "StatusCodeError") {
        err = err.message;
      }
      return exits.error(err);
    }
  }
};
function set_mapping_arr(key, value, obj) {
  function mapper(keys, value, obj = {}) {
    let keyName = keys.shift();
    if (keys.length == 0) {
      obj[keyName] = value;
    } else {
      var tmp = mapper(keys, value, obj[keyName]);
      if (!isNaN(Number(keyName)) && typeof obj[keyName] === "undefined") {
        obj = Array();
      }
      obj[keyName] = tmp;
    }
    return obj;
  }
  let keyArr = key.split("__");
  return mapper(keyArr, value, obj);
}
