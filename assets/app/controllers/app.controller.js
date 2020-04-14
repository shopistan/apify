app.controller("appCtrl", function($scope, $rootScope, $http, $sce) {
  $scope.init = async function() {
    try {
      let res = await $http.get("/peer");
      $scope.peers = res.data.data;
    } catch (err) {
      console.log("Err", err);
      toastr.error(err.data.error);
    }
  };
  $scope.changeStatus = async function(peer) {
    try {
      let res = await $http.patch(`/peer/${peer.unique}`, {
        active: peer.active
      });
      // $scope.peers = res.data.data;
      toastr.success(res.data.message);
    } catch (err) {
      console.log("Err", err);
      toastr.error(err.data.error);
    }
  };
  $scope.manualRun = async function(peer) {
    $("#manualRunModal").modal("show");
    $scope.resultRun = [
      $sce.trustAsHtml(
        `<i class="fa fa-check-circle-o text-success"></i> Manually running: <b>${
          peer.name
        }</b>`
      )
    ];
    try {
      $scope.resultRun.push(
        $sce.trustAsHtml(
          `<i class="fa fa-check-circle-o text-success"></i> Looking for new items...</b>`
        )
      );
      let res = await $http.get(`/peer/test/${peer.unique}/manula-run`);
      $scope.resultRun.push(
        $sce.trustAsHtml(
          `<i class="fa fa-check-circle-o text-success"></i> <b>${
            res.data.data.length
          } entries</b> pushed to the <b>${
            peer.peerActionApplication.name
          }</b> successfully</b>`
        )
      );
    } catch (err) {
      console.log("Err", err);
      $scope.resultRun.push(
        $sce.trustAsHtml(
          `<i class="fa fa-times-circle-o text-danger"></i> ${
            err.data.error
          }</b>`
        )
      );
    }
  };
});
