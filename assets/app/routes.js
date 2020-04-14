app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("home", {
      templateUrl: "/app/partials/home.html",
      url: "/home",
      controller: "homeCtrl",
      data: {
        authLevel: "common"
      }
    })
    .state("auth:login", {
      templateUrl: "/app/partials/auth/login.html",
      url: "/auth/login",
      controller: "authCtrl",
      data: {
        authLevel: "unauth"
      }
    })
    .state("auth:signup", {
      templateUrl: "/app/partials/auth/signup.html",
      url: "/auth/signup",
      controller: "authCtrl",
      data: {
        authLevel: "unauth"
      }
    })
    .state("user:peers", {
      templateUrl: "/app/partials/user/peers.html",
      url: "/user/peers",
      controller: "appCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("developer:apps", {
      templateUrl: "/app/partials/developer/apps.html",
      url: "/developer/apps",
      controller: "developerCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("developer:new_app", {
      templateUrl: "/app/partials/developer/new-app.html",
      url: "/developer/apps/new",
      controller: "developerCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("developer:edit_app", {
      templateUrl: "/app/partials/developer/edit-app.html",
      url: "/developer/apps/:id/edit",
      controller: "developerCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("developer:development", {
      templateUrl: "/app/partials/developer/development.html",
      url: "/developer/apps/:id/development",
      controller: "developerCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("oauth2:new", {
      templateUrl: "/app/partials/developer/auth/oauth2/new.html",
      url: "/developer/apps/:id/auth/oauth2/new",
      controller: "oauth2Ctrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("oauth2:edit", {
      templateUrl: "/app/partials/developer/auth/oauth2/edit.html",
      url: "/developer/apps/:id/auth/oauth2/:auth_id/edit",
      controller: "oauth2Ctrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("trigger:new", {
      templateUrl: "/app/partials/developer/trigger/new.html",
      url: "/developer/apps/:id/trigger/new",
      controller: "triggerCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("trigger:edit", {
      templateUrl: "/app/partials/developer/trigger/edit.html",
      url: "/developer/apps/:id/trigger/:trigger_id/edit",
      controller: "triggerCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("action:new", {
      templateUrl: "/app/partials/developer/action/new.html",
      url: "/developer/apps/:id/action/new",
      controller: "actionCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("action:edit", {
      templateUrl: "/app/partials/developer/action/edit.html",
      url: "/developer/apps/:id/action/:action_id/edit",
      controller: "actionCtrl",
      data: {
        authLevel: "admin"
      }
    })

    // Auth
    .state("auth:index", {
      templateUrl: "/app/partials/auth/dialog-box.html",
      url: "/auth/dialog/:id",
      controller: "authCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("auth:redirect", {
      templateUrl: "/app/partials/auth/dialog-redirect.html",
      url: "/auth/redirect/:id/:code",
      controller: "authCtrl",
      data: {
        authLevel: "admin"
      }
    })

    .state("editor:index", {
      templateUrl: "/app/partials/editor/index.html",
      url: "/editor/peers/:id",
      controller: "editorCtrl",
      data: {
        authLevel: "admin"
      }
    })
    // Editor Trigger
    .state("editor:trigger:app", {
      templateUrl: "/app/partials/editor/select-app.html",
      url: "/editor/peers/:id/t/:type/app",
      controller: "editorCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("editor:trigger:method", {
      templateUrl: "/app/partials/editor/select-method.html",
      url: "/editor/peers/:id/t/:type/method",
      controller: "editorCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("editor:trigger:auth", {
      templateUrl: "/app/partials/editor/select-account.html",
      url: "/editor/peers/:id/t/:type/auth",
      controller: "editorCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("editor:trigger:fields", {
      templateUrl: "/app/partials/editor/edit-fields.html",
      url: "/editor/peers/:id/t/:type/fields",
      controller: "editorCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("editor:trigger:sample", {
      templateUrl: "/app/partials/editor/sample.html",
      url: "/editor/peers/:id/t/:type/sample",
      controller: "editorCtrl",
      data: {
        authLevel: "admin"
      }
    })

    // Editor Action
    .state("editor:action:app", {
      templateUrl: "/app/partials/editor/select-app.html",
      url: "/editor/peers/:id/a/:type/app",
      controller: "editorCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("editor:action:method", {
      templateUrl: "/app/partials/editor/select-method.html",
      url: "/editor/peers/:id/a/:type/method",
      controller: "editorCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("editor:action:auth", {
      templateUrl: "/app/partials/editor/select-account.html",
      url: "/editor/peers/:id/a/:type/auth",
      controller: "editorCtrl",
      data: {
        authLevel: "admin"
      }
    })

    .state("editor:action:fields", {
      templateUrl: "/app/partials/editor/edit-fields.html",
      url: "/editor/peers/:id/a/:type/fields",
      controller: "editorCtrl",
      data: {
        authLevel: "admin"
      }
    })
    .state("editor:action:sample", {
      templateUrl: "/app/partials/editor/sample.html",
      url: "/editor/peers/:id/a/:type/sample",
      controller: "editorCtrl",
      data: {
        authLevel: "admin"
      }
    })

    .state("default", {
      templateUrl: "/app/partials/home.html",
      url: "/",
      controller: "homeCtrl",
      data: {
        authLevel: "common"
      }
    });

  $urlRouterProvider.otherwise("/home");
});
