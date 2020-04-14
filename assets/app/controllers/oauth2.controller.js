app.controller("oauth2Ctrl", function($scope, $rootScope, $state, $http) {
  $scope.appID = $state.params.id;
  $scope.new_init = function() {
    $scope.obj = {
      type: "oauthv2",
      mapping: {
        key: "Authorization",
        value: "Bearer {{access_token}}"
      }
    };
  };
  $scope.tokenMapping = function(place) {
    if (place == "header") {
      $scope.obj.mapping = {
        key: "Authorization",
        value: "Bearer {{access_token}}"
      };
    } else if (place == "query") {
      $scope.obj.mapping = {
        key: "access_token",
        value: "{{access_token}}"
      };
    }
  };
  $scope.new_oauth2 = async function(obj) {
    try {
      let data = await $http.post(`/authentication/${$scope.appID}`, obj);
      toastr.success(data.data.message);
      $state.go("developer:development", {
        id: $scope.appID
      });
    } catch (err) {
      toastr.error(err.data.error);
    }
  };
  $scope.get_oauth2 = async function() {
    try {
      let data = await $http.get(
        `/authentication/${$scope.appID}/${$state.params.auth_id}`
      );
      // toastr.success(data.data.message);
      $scope.obj = data.data.data;
    } catch (err) {
      toastr.error(err.data.error);
      $state.go("developer:development", {
        id: $scope.appID
      });
    }
  };
  $scope.edit_oauth2 = async function(obj) {
    try {
      let data = await $http.patch(
        `/authentication/${$scope.appID}/${$state.params.auth_id}`,
        obj
      );
      console.log(("Success", data.data));
      toastr.success(data.data.message);
      $state.go("developer:development", {
        id: $scope.appID
      });
    } catch (err) {
      console.log("ERROR", err.data);
      toastr.error(err.data.error);
    }
  };
  $scope.delete_oauth2 = async function(auth_id) {
    if (confirm("Do you really want to delete?")) {
      try {
        let data = await $http.delete(
          `/authentication/${$state.params.id}/${auth_id}`
        );
        toastr.success(data.data.message);
        // $scope.obj = data.data.data;
        $state.reload();
      } catch (err) {
        toastr.error(err.data.error);
        $state.go("developer:development", {
          id: $scope.appID
        });
      }
    }
  };
});
