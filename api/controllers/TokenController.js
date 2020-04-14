const uuidv4 = require("uuid/v4");
const baseURL = sails.config.custom.baseUrl;
const { pope } = require("pope");
var http = require("request-promise");
var mergeJSON = require("merge-json");
const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");
TimeAgo.locale(en);
const timeAgo = new TimeAgo("en-US");
module.exports = {
  getAll: async (request, response) => {
    try {
      let token = await Token.find({
        user: request.user.id,
        application: request.params.appId,
        status: true
      });
      token.forEach(e => {
        e.timeAgo = timeAgo.format(e.createdAt);
      });
      response.json({
        data: token,
        status: true,
        message: "Tokens Fetched Successfully"
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  getUrl: async (request, response) => {
    try {
      let application = await Application.findOne({
        unique: request.params.appId
      });
      if (!application) {
        throw { details: "No Applicaton Found With This ID" };
      }
      let authentication = await Authentication.findOne({
        application: application.id
      });
      if (!authentication) {
        throw { details: "No Authentication Found With This ID" };
      }

      response.json({
        status: true,
        message: "Authentication Send",
        data: authentication,
        url: `${authentication.authorizationUrl}?client_id=${
          authentication.clientId
        }&redirect_uri=${baseURL}/token/oauth/redirect/${
          application.unique
        }&response_type=code${
          authentication.scope == "" ? "" : "&scope=" + authentication.scope
        }&state=${Date.now()}`
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  getUrlUpdated: async (request, response) => {
    try {
      let application = await Application.findOne({
        unique: request.params.appId
      });
      if (!application) {
        throw { details: "No Applicaton Found With This ID" };
      }
      let authentication = await Authentication.findOne({
        application: application.id
      });
      if (!authentication) {
        throw { details: "No Authentication Found With This ID" };
      }
      let unique = uuidv4();
      let token = await Token.create({
        unique: unique,
        value: request.body.value,
        user: request.user.id,
        application: application.id,
        name: application.name
      }).fetch();
      response.json({
        status: true,
        message: "Authentication Send",
        data: token,
        url: pope(
          `${authentication.authorizationUrl}?client_id=${
            authentication.clientId
          }&redirect_uri=${baseURL}/token/oauth/redirect/${
            application.unique
          }&response_type=code${
            authentication.scope == "" ? "" : "&scope=" + authentication.scope
          }&state=${Date.now()}`,
          token.value
        )
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  setToken: async (request, response) => {
    try {
      let application = await Application.findOne({
        id: request.params.appId
      });
      if (!application) {
        throw { details: "No Applicaton Found With This ID" };
      }
      let unique = uuidv4();
      let token = await Token.create({
        unique: unique,
        user: request.user.id,
        application: application.id,
        name: application.name
      }).fetch();
      response.json({
        status: true,
        message: "Token Saved",
        data: token
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  redirect: async (request, response) => {
    try {
      let application = await Application.findOne({
        unique: request.params.appId
      });
      if (!application) {
        throw { details: "No Applicaton Found With This ID" };
      }
      response.redirect(
        `${baseURL}/#!/auth/redirect/${application.unique}/${
          request.query.code
        }`
      );
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  saveMappedUrl: async (request, response) => {
    try {
      let token = await Token.findOne({
        id: request.params.id
      });
      let tokenUpdate = await Token.update({
        id: token.id
      }).set({
        value: mergeJSON.merge(token.value, request.body.value)
      });
      response.json({
        status: true,
        message: "Mapped Url Saved"
      });
    } catch (error) {
      console.log(error);
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  getAccessToken: async (request, response) => {
    try {
      let application = await Application.findOne({
        unique: request.params.appId
      });
      if (!application) {
        throw { details: "No Applicaton Found With This ID" };
      }
      let authentication = await Authentication.findOne({
        application: application.id
      });
      if (!authentication) {
        throw { details: "No Authentication Found With This ID" };
      }
      let token = await Token.findOne({
        application: application.id,
        user: request.user.id,
        unique: request.params.token
      });
      if (!token) {
        throw { details: "No Token Found With This ID" };
      }
      let res = await http({
        uri: pope(`${authentication.accessTokenUrl}`, token.value),
        method: "POST",
        formData: {
          client_id: authentication.clientId,
          client_secret: authentication.clientSecret,
          grant_type: "authorization_code",
          redirect_uri: pope(
            `${baseURL}/token/oauth/redirect/${application.unique}`,
            token.value
          ),
          code: request.params.code
        },
        json: true
      });
      let values = await mergeJSON.merge(token.value, res);
      let naming = pope(`${authentication.connectionLabel}`, values, {
        skipUndefined: true
      });
      // console.log(
      //   naming + "-" + authentication.connectionLabel + " - ",
      //   values
      // );
      if (naming == authentication.connectionLabel) {
        naming = application.name;
      }
      // console.log(naming + "-" + authentication.connectionLabel);
      let updatedToken = await Token.update({
        unique: request.params.token
      })
        .set({
          token: res.access_token,
          status: true,
          value: values,
          name: naming
        })
        .fetch();
      if (updatedToken.length == "0") {
        throw { details: "No Token Found With This ID" };
      }
      response.json({
        status: true,
        message: "Access Token Got fine",
        data: res
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  }
};
