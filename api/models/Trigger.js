module.exports = {
  attributes: {
    name: {
      type: "String",
      required: true
    },
    description: {
      type: "String",
      required: true
    },
    url: {
      type: "String",
      required: true
    },
    unique: {
      type: "String",
      required: true
    },
    application: {
      model: "application"
    },
    peerTrigger: {
      collection: "peer",
      via: "peerTrigger"
    }
  }
};
