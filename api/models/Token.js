module.exports = {
  attributes: {
    name: {
      type: "String",
      defaultsTo: "No Account Name"
    },
    unique: {
      type: "String",
      required: true
    },
    token: {
      type: "String"
    },
    value: {
      type: "json"
    },
    status: {
      type: "boolean",
      defaultsTo: false
    },
    application: {
      model: "application"
    },
    user: {
      model: "user"
    },
    triggerPeers: {
      collection: "peer",
      via: "triggerToken"
    },
    ActionPeers: {
      collection: "peer",
      via: "actionToken"
    }
  }
};
