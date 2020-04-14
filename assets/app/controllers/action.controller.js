app.controller("actionCtrl", function($scope, $rootScope, $state, $http) {
  $scope.appID = $state.params.id;
  $scope.new_init = function() {
    $scope.obj = {
      fields: Array()
    };
  };
  $scope.create_action_field = function() {
    $scope.obj.fields.push({
      name: "",
      key: "",
      helpText: "",
      required: false
    });
  };
  $scope.delete_action_field = function(index) {
    $scope.obj.fields.splice(index, 1);
  };
  $scope.new_action = async function(obj) {
    try {
      let data = await $http.post(`/action/${$scope.appID}`, obj);
      toastr.success(data.data.message);
      $state.go("developer:development", {
        id: $scope.appID
      });
    } catch (err) {
      toastr.error(err.data.error);
    }
  };
  $scope.get_action = async function() {
    try {
      let data = await $http.get(
        `/action/${$scope.appID}/${$state.params.action_id}`
      );
      $scope.obj = data.data.data;
    } catch (err) {
      toastr.error(err.data.error);
      $state.go("developer:development", {
        id: $scope.appID
      });
    }
  };
  $scope.edit_action = async function(obj) {
    try {
      let data = await $http.patch(
        `/action/${$scope.appID}/${$state.params.action_id}`,
        obj
      );
      toastr.success(data.data.message);
      $state.go("developer:development", {
        id: $scope.appID
      });
    } catch (err) {
      toastr.error(err.data.error);
    }
  };
  $scope.delete_action = async function(auth_id) {
    if (confirm("Do you really want to delete?")) {
      try {
        let data = await $http.delete(`/action/${$state.params.id}/${auth_id}`);
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
