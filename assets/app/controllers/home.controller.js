app.controller("homeCtrl", function(
  $scope,
  $rootScope,
  $localStorage,
  $state,
  $http
) {
  $rootScope.$state = $state;
  $rootScope.base_url = baseURL;
  $scope.logout = function() {
    $localStorage.user = null;
    $state.reload();
  };
  $scope.make_peer = async function() {
    try {
      let app = await $http.post("peer/start");
      $state.go("editor:index", { id: app.data.data.unique });
    } catch (err) {
      toastr.error(err.data.error);
    }
  };
  $rootScope.prettyName = function(str) {
    let jh = new JsonHelper();
    return jh.prettifyCamelCase(str);
  };
});
