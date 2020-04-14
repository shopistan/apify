app.controller("developerCtrl", function($scope, $rootScope, $http, $state) {
  $scope.appID = $state.params.id;
  $scope.new_app_init = function() {
    $scope.obj = Object();
  };
  $scope.get_all = async function() {
    try {
      let apps = await $http.get("/application");
      $scope.apps = apps.data.data;
    } catch (err) {}
  };
  $scope.new_app = async function(obj) {
    try {
      let application = await $http.post("/application", obj);
      toastr.success(application.data.message);
      $state.go(`developer:development`, { id: application.data.data.unique });
    } catch (err) {
      toastr.error(err.data.error);
    }
  };
  $scope.edit_app = async function(obj) {
    try {
      let application = await $http.patch(
        `/application/${$state.params.id}`,
        obj
      );
      toastr.success(application.data.message);
      $state.go(`developer:development`, { id: $state.params.id });
    } catch (err) {
      toastr.error(err.data.error);
    }
  };
  $scope.deleteApp = async function(id) {
    try {
      let tmp = confirm("Do you really want to delete?");
      if (tmp) {
        let app = await $http.delete(`/application/${id}`);
        toastr.success(app.data.message);
        $state.reload();
      }
    } catch (err) {
      toastr.error(err.data.error);
    }
  };
  $scope.edit_app_init = async function() {
    try {
      let app = await $http.get(`/application/${$state.params.id}`);
      $scope.obj = app.data.data;
    } catch (err) {
      toastr.error(err.data.error);
      $state.go("developer:apps");
    }
  };
  $scope.get_app = async function() {
    try {
      let app = await $http.get(`/application/${$state.params.id}`);
      $scope.obj = app.data.data;
    } catch (err) {
      toastr.error(err.data.error);
      $state.go("developer:apps");
    }
  };
  $scope.uploadedFile = function() {
    $("#prog-div").show();
    $("#prog").val(0);
    $("#image").upload(
      "application/upload-icon",
      function(res) {
        // console.log(res);
        if (res.status == true) {
          $scope.obj.image = res.data;
          if (!$scope.$phase) $scope.$apply();
        } else {
          toastr.error(res.error);
        }
      },
      $("#prog")
    );
  };
});
