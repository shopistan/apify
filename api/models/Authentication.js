module.exports = {
  attributes: {
    type: {
      type: "String",
      required: true,
      isIn: ["oauthv2", "basic", "apikey", "none"]
    },
    authPlacement: {
      type: "String",
      isIn: ["header", "query", "both"]
    },
    connectionLabel: {
      type: "String"
    },
    clientId: {
      type: "String"
    },
    clientSecret: {
      type: "String"
    },
    authorizationUrl: {
      type: "String"
    },
    accessTokenUrl: {
      type: "String"
    },
    mapping: {
      type: "json"
    },
    extraRequestedFields: {
      type: "String"
    },
    scope: {
      type: "String"
    },
    unique: {
      type: "String",
      required: true
    },
    aboutMe: {
      type: "String"
    },
    application: {
      model: "application"
    }
  }
};
