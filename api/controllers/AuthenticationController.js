const uuidv4 = require("uuid/v4");
module.exports = {
  add: async (request, response) => {
    try {
      let application = await Application.findOne({
        unique: request.params.appId,
        user: request.user.id
      });
      if (!application) {
        throw { details: "No Application Found With This ID" };
      }
      let unique = uuidv4();
      let authentication = await Authentication.create({
        unique: unique,
        type: request.body.type,
        authPlacement: request.body.authPlacement,
        connectionLabel: request.body.connectionLabel,
        clientId: request.body.clientId,
        clientSecret: request.body.clientSecret,
        authorizationUrl: request.body.authorizationUrl,
        accessTokenUrl: request.body.accessTokenUrl,
        extraRequestedFields: request.body.extraRequestedFields,
        scope: request.body.scope,
        aboutMe: request.body.aboutMe,
        mapping: request.body.mapping,
        application: application.id
      }).fetch();
      response.json({
        data: authentication,
        status: true,
        message: "Authentication Added Successfully"
      });
    } catch (error) {
      response.status(400).json(
        {
          status: false,
          error: error.details
        } || "Error occoured"
      );
    }
  },
  update: async (request, response) => {
    try {
      let application = await Application.findOne({
        unique: request.params.appId,
        user: request.user.id
      });
      if (!application) {
        throw { details: "No Application Found With This ID" };
      }
      let authentication = await Authentication.update({
        unique: request.params.id,
        application: application.id
      })
        .set({
          type: request.body.type,
          authPlacement: request.body.authPlacement,
          connectionLabel: request.body.connectionLabel,
          clientId: request.body.clientId,
          clientSecret: request.body.clientSecret,
          authorizationUrl: request.body.authorizationUrl,
          accessTokenUrl: request.body.accessTokenUrl,
          aboutMe: request.body.aboutMe,
          extraRequestedFields: request.body.extraRequestedFields,
          mapping: request.body.mapping,
          scope: request.body.scope
        })
        .fetch();
      if (authentication.length == "0") {
        throw { details: "No Authentication Found With This ID" };
      }
      response.json({
        data: authentication[0],
        status: true,
        message: "Authentication Updated Successfully"
      });
    } catch (error) {
      response.status(400).json(
        {
          status: false,
          error: error.details
        } || "Error occoured"
      );
    }
  },
  getAll: async (request, response) => {
    try {
      let application = await Application.findOne({
        unique: request.params.appId,
        user: request.user.id
      });
      if (!application) {
        throw { details: "No Application Found With This ID" };
      }
      let authentication = await Authentication.find({
        application: application.id
      });
      response.json({
        data: authentication,
        status: true,
        message: "All Authentication Fetched Successfully"
      });
    } catch (error) {
      response.status(400).json(
        {
          status: false,
          error: error.details
        } || "Error occoured"
      );
    }
  },
  getById: async (request, response) => {
    try {
      let application = await Application.findOne({
        unique: request.params.appId,
        user: request.user.id
      });
      if (!application) {
        throw { details: "No Application Found With This ID" };
      }
      let authentication = await Authentication.findOne({
        application: application.id,
        unique: request.params.id
      });
      if (!authentication) {
        throw { details: "No Authentication Found With This ID" };
      }
      response.json({
        data: authentication,
        status: true,
        message: "Authentication Fetched Successfully"
      });
    } catch (error) {
      response.status(400).json(
        {
          status: false,
          error: error.details
        } || "Error occoured"
      );
    }
  },
  delete: async (request, response) => {
    try {
      let application = await Application.findOne({
        unique: request.params.appId,
        user: request.user.id
      });
      if (!application) {
        throw { details: "No Application Found With This ID" };
      }
      let authentication = await Authentication.destroy({
        application: application.id,
        unique: request.params.id
      }).fetch();
      if (authentication.length == "0") {
        throw { details: "No Authentication Found With This ID" };
      }
      response.json({
        data: authentication[0],
        status: true,
        message: "Authentication Deleted Successfully"
      });
    } catch (error) {
      response.status(400).json(
        {
          status: false,
          error: error.details
        } || "Error occoured"
      );
    }
  }
};
