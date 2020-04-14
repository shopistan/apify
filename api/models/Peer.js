module.exports = {
  attributes: {
    name: {
      type: "String",
      defaultsTo: "No Flow Name"
    },
    unique: {
      type: "String",
      required: true
    },
    peerActionApplication: {
      model: "application"
    },
    peerTriggerApplication: {
      model: "application"
    },
    peerAction: {
      model: "action"
    },
    triggerResponse: {
      type: "json"
    },
    actionMapping: {
      type: "json"
    },
    peerActionUrl: {
      type: "string"
    },
    peerTriggerUrl: {
      type: "string"
    },
    peerProcessedId: {
      type: "string"
    },
    peerTrigger: {
      model: "trigger"
    },
    active: {
      type: "boolean"
    },
    complete: {
      type: "boolean"
    },
    user: {
      model: "user"
    },
    triggerToken: {
      model: "token"
    },
    actionToken: {
      model: "token"
    }
  }
};
