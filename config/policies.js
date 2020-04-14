module.exports.policies = {
  // '*': true,
  "user/*": "isLoggedIn",
  UserController: {
    login: true,
    create: true
  },
  "application/*": "isLoggedIn",
  "authentication/*": "isLoggedIn",
  "trigger/*": "isLoggedIn",
  "action/*": "isLoggedIn",
  "peer/*": "isLoggedIn",
  "token/*": "isLoggedIn",
  TokenController: {
    redirect: true
  },
  ApplicationController: {
    uploadIcon: true,
    file: true
  }
};
