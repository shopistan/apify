const uuidv4 = require("uuid/v4");
const { pope } = require("pope");
var http = require("request-promise");
const baseURL = sails.config.custom.baseUrl;

module.exports = {
  start: async (request, response) => {
    try {
      let unique = uuidv4();
      let peer = await Peer.create({
        unique: unique,
        active: false,
        complete: false,
        user: request.user.id
      }).fetch();
      response.json({
        data: peer,
        status: true,
        message: "Peer Started Successfully"
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  getAll: async (request, response) => {
    try {
      let peer = await Peer.find({
        user: request.user.id
      }).populateAll();
      if (peer.length == 0) {
        throw { details: "No Flow Found Of This User" };
      }
      response.json({
        data: peer,
        status: true,
        message: "All Flow Fetched Successfully"
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  getById: async (request, response) => {
    try {
      let peer = await Peer.findOne({
        user: request.user.id,
        unique: request.params.id
      }).populateAll();
      let schema = await Peer.findOne({
        user: request.user.id,
        unique: request.params.id
      });
      let actionAuth = await Application.findOne({
        id: schema.peerActionApplication
      }).populateAll();
      let triggerAuth = await Application.findOne({
        id: schema.peerTriggerApplication
      }).populateAll();

      if (!peer) {
        throw { details: "No action Found With This ID" };
      }
      if (!actionAuth) {
        actionAuth = {
          auth: 0
        };
      } else {
        let actionData = await Action.findOne({
          id: schema.peerAction
        });
        let actionValue = await Token.findOne({
          id: schema.actionToken
        });
        if (!actionData) {
          actionAuth = {
            auth: actionAuth.authentications.length
          };
        } else {
          if (!actionValue) {
            actionAuth = {
              auth: actionAuth.authentications.length,
              urlBasic: actionData.url,
              value: null,
              urlComplete: actionData.url
            };
          } else {
            actionAuth = {
              auth: actionAuth.authentications.length,
              urlBasic: actionData.url,
              value: actionValue.value,
              urlComplete: pope(`${actionData.url}`, actionValue.value, {
                skipUndefined: true
              })
            };
          }
        }
      }
      if (!triggerAuth) {
        triggerAuth = {
          auth: 0
        };
      } else {
        let TriggerData = await Trigger.findOne({
          id: schema.peerTrigger
        });
        let triggerValue = await Token.findOne({
          id: schema.triggerToken
        });
        if (!TriggerData) {
          triggerAuth = {
            auth: triggerAuth.authentications.length
          };
        } else {
          if (!triggerValue) {
            triggerAuth = {
              auth: triggerAuth.authentications.length,
              urlBasic: TriggerData.url,
              value: null,
              urlComplete: TriggerData.url
            };
          } else {
            triggerAuth = {
              auth: triggerAuth.authentications.length,
              urlBasic: TriggerData.url,
              value: triggerValue.value,
              urlComplete: pope(`${TriggerData.url}`, triggerValue.value, {
                skipUndefined: true
              })
            };
          }
        }
      }
      response.json({
        data: peer,
        schema: schema,
        actionOptions: actionAuth,
        triggerOptions: triggerAuth,
        status: true,
        message: "Action Fetched Successfully"
      });
    } catch (error) {
      console.log(error);
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  save: async (request, response) => {
    try {
      let peer = await Peer.update({
        unique: request.params.id
      })
        .set(request.body)
        .fetch();
      if (peer.length == "0") {
        // console.log("dasd");
        throw { details: "No Flow Found With This ID" };
      }
      response.json({
        data: peer[0],
        status: true,
        message: "Flow Updated Successfully"
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  testTrigger: async (request, response) => {
    try {
      let peer = await Peer.findOne({
        unique: request.params.id,
        user: request.user.id
      });
      if (!peer) {
        throw { details: "No Flow Found With This ID" };
      }
      var data = await sails.helpers.trigger(peer, true);
      if (!data.length) {
        throw {
          details:
            "There is no entry coming from the API, Make sure you have atleast one entry in the application"
        };
      }
      response.json({
        data: data[0],
        message: "Test Successful!",
        status: true
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || error.raw || "Error occoured"
      });
    }
  },
  testPeer: async (request, response) => {
    try {
      let peer = await Peer.findOne({
        unique: request.params.id,
        user: request.user.id
      });
      if (!peer) {
        throw { details: "No Flow Found With This ID" };
      }
      let flag = false;
      if (request.params.flag == "editor-test") {
        flag = true;
      }
      var data = await sails.helpers.trigger(peer, flag);
      if (!data.length) {
        throw {
          details:
            "There is no entry coming from the API, Make sure you have atleast one entry in the application"
        };
      }
      //Action test begin here
      let response2 = await sails.helpers.action(peer, data);
      let peerUpdate = await Peer.update({
        id: peer.id
      }).set({
        complete: true
      });
      response.json({
        data: response2,
        message: "Test Successful!",
        status: true
      });
    } catch (error) {
      // console.log(error.message);
      response.status(400).json({
        status: false,
        error: error.details || error.raw || "Error occoured"
      });
    }
  }
};
