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
      let trigger = await Trigger.create({
        unique: unique,
        name: request.body.name,
        description: request.body.description,
        url: request.body.url,
        application: application.id
      }).fetch();
      response.json({
        data: trigger,
        status: true,
        message: "Trigger Added Successfully"
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
      let trigger = await Trigger.update({
        unique: request.params.id,
        application: application.id
      })
        .set({
          name: request.body.name,
          description: request.body.description,
          url: request.body.url
        })
        .fetch();
      if (trigger.length == "0") {
        throw { details: "No Trigger Found With This ID" };
      }
      response.json({
        data: trigger[0],
        status: true,
        message: "Trigger Updated Successfully"
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
      let trigger = await Trigger.find({
        application: application.id
      });
      response.json({
        data: trigger,
        status: true,
        message: "All Trigger Fetched Successfully"
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
      let trigger = await Trigger.findOne({
        application: application.id,
        unique: request.params.id
      });
      if (!trigger) {
        throw { details: "No Trigger Found With This ID" };
      }
      response.json({
        data: trigger,
        status: true,
        message: "Trigger Fetched Successfully"
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
      let trigger = await Trigger.destroy({
        application: application.id,
        unique: request.params.id
      }).fetch();
      if (trigger.length == "0") {
        throw { details: "No Trigger Found With This ID" };
      }
      response.json({
        data: trigger[0],
        status: true,
        message: "Trigger Deleted Successfully"
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
