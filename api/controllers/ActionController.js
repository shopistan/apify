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
      let action = await Action.create({
        unique: unique,
        name: request.body.name,
        description: request.body.description,
        url: request.body.url,
        application: application.id,
        fields: request.body.fields
      }).fetch();
      response.json({
        data: action,
        status: true,
        message: "Action Added Successfully"
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
      let action = await Action.update({
        unique: request.params.id,
        application: application.id
      })
        .set({
          name: request.body.name,
          description: request.body.description,
          url: request.body.url,
          fields: request.body.fields
        })
        .fetch();
      if (action.length == "0") {
        throw { details: "No Action Found With This ID" };
      }
      response.json({
        data: action[0],
        status: true,
        message: "Action Updated Successfully"
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
      let action = await Action.find({
        application: application.id
      });
      response.json({
        data: action,
        status: true,
        message: "All action Fetched Successfully"
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
      let action = await Action.findOne({
        application: application.id,
        unique: request.params.id
      });
      if (!action) {
        throw { details: "No action Found With This ID" };
      }
      response.json({
        data: action,
        status: true,
        message: "action Fetched Successfully"
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
  getFields: async (request, response) => {
    try {
      let action = await Action.findOne({
        id: request.params.id
      });
      if (!action) {
        throw { details: "No action Found With This ID" };
      }
      response.json({
        data: action,
        status: true,
        message: "action Fetched Successfully"
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
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
      let action = await Action.destroy({
        application: application.id,
        unique: request.params.id
      }).fetch();
      if (action.length == "0") {
        throw { details: "No action Found With This ID" };
      }
      response.json({
        data: action[0],
        status: true,
        message: "action Deleted Successfully"
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
