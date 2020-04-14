const uuidv4 = require("uuid/v4");
module.exports = {
  add: async (request, response) => {
    try {
      let unique = uuidv4();
      let application = await Application.create({
        unique: unique,
        name: request.body.name,
        description: request.body.description,
        user: request.user.id
      }).fetch();
      response.json({
        status: true,
        message: "Application Added Successfully",
        data: application
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  getAll: async (request, response) => {
    try {
      let applications = await Application.find({
        user: request.user.id
      });
      response.json({
        status: true,
        message: "All Applications Fetched",
        data: applications
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  getAllApplications: async (request, response) => {
    try {
      let applications = await Application.find().populateAll();
      response.json({
        status: true,
        message: "All Applications Fetched",
        data: applications
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  updateTo: async (request, response) => {
    try {
      let application = await Application.update({
        unique: request.params.id,
        user: request.user.id
      })
        .set({
          name: request.body.name,
          description: request.body.description,
          image: request.body.image
        })
        .fetch();
      if (application.length == "0") {
        // console.log("dasd");
        throw { details: "No Applicaton Found With This ID" };
      }
      response.json({
        status: true,
        message: " Applications Updated",
        data: application[0]
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
      let application = await Application.destroy({
        unique: request.params.id,
        user: request.user.id
      }).fetch();
      if (application.length == "0") {
        throw { details: "No Applicaton Found With This ID" };
      }
      response.json({
        status: true,
        message: "Applications Deleted",
        data: application[0]
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  getByID: async (request, response) => {
    try {
      let application = await Application.findOne({
        unique: request.params.id,
        user: request.user.id
      }).populateAll();
      if (!application) {
        throw { details: "No Applicaton Found With This ID" };
      }
      response.json({
        status: true,
        message: " Applications Fetched",
        data: application
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  getByIdPeer: async (request, response) => {
    try {
      let application = await Application.findOne({
        id: request.params.id
      }).populateAll();
      if (!application) {
        throw { details: "No Applicaton Found With This ID" };
      }
      response.json({
        status: true,
        message: " Applications Fetched",
        data: application
      });
    } catch (error) {
      response.status(400).json({
        status: false,
        error: error.details || "Error occoured"
      });
    }
  },
  uploadIcon: async (request, response) => {
    request.file("icon").upload(
      {
        dirname: require("path").resolve(sails.config.appPath, "assets/uploads")
      },
      function(err, uploadedFiles) {
        if (err) return response.serverError(err);
        var baseUrl = sails.config.custom.baseUrl;
        if (!uploadedFiles.length)
          return response.serverError({
            status: false,
            error: "Image can not be uploaded"
          });
        // console.log(uploadedFiles[0]);
        let fileName = uploadedFiles[0]["fd"].split("/");
        fileName = fileName[fileName.length - 1];
        fileName = fileName.replace(".", "~");
        return response.json({
          message: uploadedFiles.length + " file(s) uploaded successfully!",
          data: require("util").format(
            "%s/application/file/%s",
            baseUrl,
            fileName
          ),
          status: true
        });
      }
    );
  },
  file: async (request, response) => {
    const fs = require("fs");
    let filename = request.params.filename.replace("~", ".");
    let path = require("path").resolve(
      sails.config.appPath,
      `assets/uploads/${filename}`
    );
    console.log("CAME", path);
    if (fs.existsSync(path)) {
      response.sendFile(path);
    } else {
      return response.notFound();
    }
  }
};
