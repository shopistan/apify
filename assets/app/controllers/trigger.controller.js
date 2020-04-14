app.controller("triggerCtrl", function($scope, $rootScope, $state, $http) {
  $scope.appID = $state.params.id;
  $scope.new_init = function() {
    $scope.obj = Object();
  };
  $scope.new_trigger = async function(obj) {
    try {
      let data = await $http.post(`/trigger/${$scope.appID}`, obj);
      toastr.success(data.data.message);
      $state.go("developer:development", {
        id: $scope.appID
      });
    } catch (err) {
      toastr.error(err.data.error);
    }
  };
  $scope.get_trigger = async function() {
    try {
      let data = await $http.get(
        `/trigger/${$scope.appID}/${$state.params.trigger_id}`
      );
      $scope.obj = data.data.data;
    } catch (err) {
      toastr.error(err.data.error);
      $state.go("developer:development", {
        id: $scope.appID
      });
    }
  };
  $scope.edit_trigger = async function(obj) {
    try {
      let data = await $http.patch(
        `/trigger/${$scope.appID}/${$state.params.trigger_id}`,
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
  $scope.delete_trigger = async function(auth_id) {
    if (confirm("Do you really want to delete?")) {
      try {
        let data = await $http.delete(
          `/trigger/${$state.params.id}/${auth_id}`
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
