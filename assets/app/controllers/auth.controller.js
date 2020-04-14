app.controller("authCtrl", function(
  $scope,
  $rootScope,
  $http,
  $state,
  $localStorage
) {
  $scope.init = function() {
    $scope.obj = Object();
  };
  $scope.signup = async function(obj) {
    try {
      let res = await $http.post("/user", obj);
      toastr.success("Sign up successfull");
      $state.go("auth:login");
    } catch (err) {
      console.log(err);
      let errMsg = "";
      if (err.data.code === "E_UNIQUE") {
        errMsg = "User already exists, please try to log in";
      } else {
        errMsg = "Something went wrong, please try again";
      }
      toastr.error(errMsg);
    }
  };
  $scope.login = async function(obj) {
    try {
      let res = await $http.post("/user/login", obj);
      $localStorage.user = res.data;
      toastr.success("Login successfull");
      $state.go("home");
    } catch (err) {
      toastr.error(err.data.error);
    }
  };
  $scope.init_auth = async function() {
    try {
      let auth = await $http.get(`/token/oauth/${$state.params.id}`);
      $scope.auth = auth.data;
      $scope.inputs = getPope($scope.auth.url);
      if ($scope.inputs.length == 0) {
        $scope.continueAuth({});
      }
      $scope.obj = Object();
    } catch (err) {
      console.log("Err", err);
    }
  };
  $scope.continueAuth = async function(obj) {
    try {
      let data = await $http.patch(`/token/oauth/${$state.params.id}`, {
        value: obj
      });
      $localStorage.auth_temp_id = data.data.data.unique;
      window.location = data.data.url;
    } catch (err) {
      console.log("Err", err);
      toastr.error(err.data.error);
    }
  };
  $scope.redirect_oauth2 = async function() {
    try {
      let data = await $http.get(
        `/token/oauth/redirect/${$state.params.id}/${$state.params.code}/${
          $localStorage.auth_temp_id
        }`
      );
      let res = {
        type: "OAuth_Token"
      };
      res.data = JSON.parse(
        JSON.stringify(data.data.data).replace(/(\r\n\t|\n|\r\t)/gm, "")
      );
      window.opener.postMessage(res, $rootScope.base_url); // To send data to domain
    } catch (err) {
      console.log("Err", err);
      toastr.error(err.data.error);
    }
    window.close();
  };
});
