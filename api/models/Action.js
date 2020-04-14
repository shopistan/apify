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
    fields: {
      type: "json",
      required: true
    },
    application: {
      model: "application"
    },
    peerAction: {
      collection: "peer",
      via: "peerAction"
    }
  }
};
