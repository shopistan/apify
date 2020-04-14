var app = angular.module("webpeer", [
  "ui.router",
  "angular-loading-bar",
  "cfp.loadingBar",
  "ngStorage",
  "ngSanitize"
]);

app.config([
  "cfpLoadingBarProvider",
  function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
  }
]);
app.config(function($httpProvider, $locationProvider) {
  $httpProvider.defaults.headers.post["Content-Type"] = "application/json";
  $httpProvider.interceptors.push("httpRequestInterceptor");
});
app.factory("httpRequestInterceptor", function($localStorage) {
  return {
    request: function(config) {
      if (
        typeof $localStorage.user !== "undefined" &&
        $localStorage.user !== null &&
        $localStorage.user !== ""
      ) {
        var auth_headers = $localStorage.user.access_token;
        config.headers["Authorization"] = `Bearer ${auth_headers}`;
      }
      return config;
    }
  };
});
app.factory("authFactory", function($localStorage, $http, $rootScope) {
  return {
    async authenticate() {
      try {
        let res = await $http.get("/user/me");
        $rootScope.isAuth = true;
        $rootScope.user = res.data;
        return res.data;
      } catch (err) {
        $localStorage.user = null;
        $rootScope.isAuth = false;
        $rootScope.user = null;
        return err.data;
      }
    }
  };
});
app.run(function($state, $rootScope, $transitions, authFactory) {
  $rootScope.factryAuth = true;
  $transitions.onStart({}, async function(trans) {
    let routeLevel = trans.$to().data.authLevel;
    let user = await authFactory.authenticate();
    if (routeLevel == "admin") {
      // enter only if authneticated
      if ($rootScope.isAuth != true) {
        $state.go("auth:login");
      }
    } else if (routeLevel == "unauth") {
      // do not enter if already authenticated
      if ($rootScope.isAuth == true) {
        $state.go("home");
      }
    } else {
      // enter anyway
      return;
    }
  });
});
