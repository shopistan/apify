module.exports = {
  attributes: {
    unique: {
      type: "String",
      required: true
    },
    name: {
      type: "String",
      required: true
    },
    image: {
      type: "String",
      defaultsTo: `${sails.config.custom.baseUrl}/images/default-app.png`
    },
    description: {
      type: "String",
      required: true
    },
    user: {
      model: "user"
    },
    authentications: {
      collection: "authentication",
      via: "application"
    },
    triggers: {
      collection: "trigger",
      via: "application"
    },
    actions: {
      collection: "action",
      via: "application"
    },
    peerActionApplication: {
      collection: "peer",
      via: "peerActionApplication"
    },
    peerTriggerApplication: {
      collection: "peer",
      via: "peerTriggerApplication"
    },
    tokens: {
      collection: "token",
      via: "application"
    }
  }
};
