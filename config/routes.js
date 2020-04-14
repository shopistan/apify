module.exports.routes = {
  "/": {
    view: "pages/homepage"
  },
  //User Controller Routes
  "POST /user/login": "UserController.login",
  "GET /user/me": "UserController.me",

  //Application Controller Routes
  "POST /application": "ApplicationController.add",
  "GET /application": "ApplicationController.getAll",
  "GET /application/all": "ApplicationController.getAllApplications",
  "GET /application/:id": "ApplicationController.getByID",
  "PATCH /application/:id": "ApplicationController.updateTo",
  "DELETE /application/:id": "ApplicationController.delete",
  "GET /application/peer/:id": "ApplicationController.getByIdPeer",
  "POST /application/upload-icon": "ApplicationController.uploadIcon",
  "GET /application/file/:filename": "ApplicationController.file",

  //Authentication Controller Routes

  "POST /authentication/:appId": "AuthenticationController.add",
  "PATCH /authentication/:appId/:id": "AuthenticationController.update",
  "GET /authentication/:appId/:id": "AuthenticationController.getById",
  "DELETE /authentication/:appId/:id": "AuthenticationController.delete",
  "GET /authentication/:appId": "AuthenticationController.getAll",

  //Trigger Controller Routes

  "POST /trigger/:appId": "TriggerController.add",
  "PATCH /trigger/:appId/:id": "TriggerController.update",
  "GET /trigger/:appId/:id": "TriggerController.getById",
  "DELETE /trigger/:appId/:id": "TriggerController.delete",
  "GET /trigger/:appId": "TriggerController.getAll",

  //Action Controller Routes

  "POST /action/:appId": "ActionController.add",
  "PATCH /action/:appId/:id": "ActionController.update",
  "GET /action/:appId/:id": "ActionController.getById",
  "GET /action/fields/:id": "ActionController.getFields",
  "DELETE /action/:appId/:id": "ActionController.delete",
  "GET /action/:appId": "ActionController.getAll",

  //Peer Controller Routes

  "POST /peer/start/": "PeerController.start",
  "GET /peer/:id": "PeerController.getById",
  "GET /peer": "PeerController.getAll",
  "PATCH /peer/:id": "PeerController.save",
  "GET /peer/test/trigger/:id": "PeerController.testTrigger",
  "GET /peer/test/:id/:flag": "PeerController.testPeer",

  //Token Controller Routes

  "GET /token/:appId": "TokenController.getAll",
  "GET /token/oauth/:appId": "TokenController.getUrl",
  "PATCH /token/oauth/:appId": "TokenController.getUrlUpdated",
  "POST /token/:appId": "TokenController.setToken",
  "PATCH /token/map/:id": "TokenController.saveMappedUrl",
  "GET /token/oauth/redirect/:appId": "TokenController.redirect",
  "GET /token/oauth/redirect/:appId/:code/:token":
    "TokenController.getAccessToken"
};
