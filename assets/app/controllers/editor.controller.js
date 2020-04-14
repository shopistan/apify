app.controller("editorCtrl", function($scope, $rootScope, $http, $state) {
  $scope.app_id = $state.params.id;
  $scope.type = $state.params.type;
  $scope.continueAllow = false;
  $scope.init = async function() {
    $scope.selectedApp = "";
    $scope.selectedMethod = "";
    $scope.selectedAccount = "";
    try {
      let app = await $http.get(`/peer/${$state.params.id}`);
      $scope.application = app.data.data;
      $scope.obj = app.data.schema;
      $scope.triggerOptions = app.data.triggerOptions;
      $scope.actionOptions = app.data.actionOptions;
      if ($state.params.type == "trigger") {
        if ($scope.obj.peerTriggerApplication != null) {
          $scope.continueAllow = true;
          $scope.selectedApp = $scope.obj.peerTriggerApplication.toString();
        } else if ($state.current.name == "editor:trigger:app") {
          $scope.continueAllow = false;
        }
        if ($scope.obj.peerTrigger != null) {
          $scope.continueAllow = true;
          $scope.selectedMethod = $scope.obj.peerTrigger.toString();
        } else if ($state.current.name == "editor:trigger:method") {
          $scope.continueAllow = false;
        }
        if ($scope.obj.triggerToken != null) {
          $scope.continueAllow = true;
          $scope.selectedAccount = $scope.obj.triggerToken.toString();
        } else if ($state.current.name == "editor:trigger:auth") {
          $scope.continueAllow = false;
        }
        if ($scope.obj.triggerResponse != null) {
          $scope.continueAllow = true;
        } else if ($state.current.name == "editor:trigger:sample") {
          $scope.continueAllow = false;
        }
      } else if ($state.params.type == "action") {
        if ($scope.obj.peerActionApplication != null) {
          $scope.continueAllow = true;
          $scope.selectedApp = $scope.obj.peerActionApplication.toString();
        } else if ($state.current.name == "editor:action:app") {
          $scope.continueAllow = false;
        }
        if ($scope.obj.peerAction != null) {
          $scope.continueAllow = true;
          $scope.selectedMethod = $scope.obj.peerAction.toString();
        } else if ($state.current.name == "editor:action:method") {
          $scope.continueAllow = false;
        }
        if ($scope.obj.actionToken != null) {
          $scope.continueAllow = true;
          $scope.selectedAccount = $scope.obj.actionToken.toString();
        } else if ($state.current.name == "editor:action:auth") {
          $scope.continueAllow = false;
        }
        if ($scope.obj.complete == true) {
          $scope.continueAllow = true;
        } else if ($state.current.name == "editor:action:sample") {
          $scope.continueAllow = false;
        }
      }

      // Check steps
      if ($scope.application.peerTriggerApplication == null) {
        $state.go("editor:trigger:app", {
          id: $state.params.id,
          type: "trigger"
        });
      }
    } catch (err) {
      console.log(err);
      toastr.error(err.data.error);
      $state.go("home");
    }
  };
  $scope.continue = async function(obj, nextState, complete = false) {
    try {
      let dataToSend = { ...obj };
      delete dataToSend["createdAt"];
      delete dataToSend["updatedAt"];
      delete dataToSend["user"];
      delete dataToSend["unique"];

      if ($state.params.type == "trigger") {
        if (
          $scope.application.peerTriggerApplication != null &&
          $scope.application.peerTriggerApplication.id !=
            $scope.obj.peerTriggerApplication
        ) {
          dataToSend.peerTrigger = null;
          dataToSend.triggerToken = null;
          dataToSend.peerTriggerUrl = "";
          dataToSend.complete = false;
        }
        if (
          $scope.application.peerTrigger != null &&
          $scope.application.peerTrigger.id != $scope.obj.peerTrigger
        ) {
          dataToSend.actionMapping = null;
          dataToSend.triggerResponse = null;
          dataToSend.complete = false;
        }
      } else if ($state.params.type == "action") {
        if (
          $scope.application.peerActionApplication != null &&
          $scope.application.peerActionApplication.id !=
            $scope.obj.peerActionApplication
        ) {
          dataToSend.peerAction = null;
          dataToSend.actionToken = null;
          dataToSend.peerActionUrl = "";
          dataToSend.complete = false;
        }
        if (
          $scope.application.peerAction != null &&
          $scope.application.peerAction.id != $scope.obj.peerAction
        ) {
          dataToSend.actionMapping = null;
          dataToSend.complete = false;
        }
      }
      // console.log("complete", dataToSend.complete);
      dataToSend.peerProcessedId =
        dataToSend.complete == false ? "" : dataToSend.peerProcessedId;
      dataToSend.active =
        dataToSend.complete == false ? false : dataToSend.active;
      let res = await $http.patch(`peer/${$state.params.id}`, dataToSend);
      if (complete) {
        toastr.success(res.data.message);
        $state.reload();
      } else {
        $state.go(nextState, {
          id: $state.params.id,
          type: nextState.split(":")[1]
        });
      }
    } catch (err) {
      console.log(err);
      toastr.error(err.data.error);
    }
  };
  $scope.get_all_apps = async function() {
    try {
      await $scope.init();
      let apps = await $http.get("/application/all");
      if ($state.params.type == "trigger") {
        $scope.apps = apps.data.data.filter(e => e.triggers.length);
      } else if ($state.params.type == "action") {
        $scope.apps = apps.data.data.filter(e => e.actions.length);
      }
    } catch (err) {
      console.log("ERROR", err.data);
    }
  };
  $scope.changeApp = function(a) {
    if ($state.params.type == "trigger") {
      $scope.obj.peerTriggerApplication = a.id;
    } else if ($state.params.type == "action") {
      $scope.obj.peerActionApplication = a.id;
    }
    $scope.continueAllow = true;
  };
  $scope.changeMethod = function(a) {
    if ($state.params.type == "trigger") {
      $scope.obj.peerTrigger = a.id;
    } else if ($state.params.type == "action") {
      $scope.obj.peerAction = a.id;
    }
    $scope.continueAllow = true;
  };
  $scope.changeAccount = function(a) {
    if ($state.params.type == "trigger") {
      $scope.obj.triggerToken = a.id;
    } else if ($state.params.type == "action") {
      $scope.obj.actionToken = a.id;
    }
    $scope.continueAllow = true;
  };
  $scope.get_all_methods = async function() {
    try {
      await $scope.init();
      $scope.methods = [];
      if ($state.params.type == "trigger") {
        let app = await $http.get(
          `/application/peer/${$scope.obj.peerTriggerApplication}`
        );
        $scope.methods = app.data.data.triggers;
      } else if ($state.params.type == "action") {
        let app = await $http.get(
          `/application/peer/${$scope.obj.peerActionApplication}`
        );
        $scope.methods = app.data.data.actions;
      }
    } catch (err) {
      console.log("Err", err);
      $state.go("editor:index", {
        id: $state.params.id
      });
    }
  };
  $scope.get_all_accounts = async function() {
    try {
      await $scope.init();
      $scope.accounts = [];
      if ($state.params.type == "trigger") {
        let authCheck = await $http.get(
          `/application/peer/${$scope.obj.peerTriggerApplication}`
        );
        if (authCheck.data.data.authentications.length == 0) {
          if (
            $state.params.type == "trigger" &&
            $scope.obj.triggerToken == null
          ) {
            let dumy_auth = await $http.post(
              `token/${$scope.obj.peerTriggerApplication}`
            );
            $scope.obj.triggerToken = dumy_auth.data.data.id;
          }
          throw {
            status: "NO_AUTH"
          };
        }
        let app = await $http.get(
          `/token/${$scope.obj.peerTriggerApplication}`
        );
        $scope.app = authCheck.data.data;
        $scope.accounts = app.data.data;
      } else if ($state.params.type == "action") {
        let authCheck = await $http.get(
          `/application/peer/${$scope.obj.peerActionApplication}`
        );
        if (authCheck.data.data.authentications.length == 0) {
          if (
            $state.params.type == "action" &&
            $scope.obj.actionToken == null
          ) {
            let dumy_auth = await $http.post(
              `token/${$scope.obj.peerTriggerApplication}`
            );
            $scope.obj.actionToken = dumy_auth.data.data.id;
          }
          throw {
            status: "NO_AUTH"
          };
        }
        let app = await $http.get(`/token/${$scope.obj.peerActionApplication}`);
        $scope.app = authCheck.data.data;
        $scope.accounts = app.data.data;
      }
    } catch (err) {
      console.log("Err", err);
      if (err.status == "NO_AUTH") {
        // $scope.reload();
        if ($state.params.type == "trigger") {
          $scope.continue($scope.obj, "editor:trigger:fields");
        } else if ($state.params.type == "action") {
          $scope.continue($scope.obj, "editor:action:fields");
        }
      }
      $state.go("editor:index", {
        id: $state.params.id
      });
    }
  };
  $scope.authDialog = function(id) {
    let uri = `#!/auth/dialog/${id}`;
    var oAuthDialog = window.open(
      uri,
      "oAuth2AuthenticateDialog",
      "width=700,height=500"
    );
  };
  let windowEventFunc = function(event) {
    if (event.data.type == "OAuth_Token") {
      console.log("Auth Retured", event.data);
      $state.reload();
      window.removeEventListener("message", windowEventFunc);
    }
  };
  window.addEventListener("message", windowEventFunc, false);
  $scope.getPopeLength = function(e) {
    if (typeof e === "undefined") return 0;
    return getPope(e).length;
  };
  $scope.edit_options_init = async function() {
    try {
      await $scope.init();
      $scope.mappingFields = Array();
      if ($state.params.type == "trigger") {
        $scope.url = $scope.triggerOptions.urlBasic;
        $scope.urlParse = $scope.triggerOptions.urlComplete;
        $scope.optValues = $scope.triggerOptions.value;
      } else if ($state.params.type == "action") {
        $scope.url = $scope.actionOptions.urlBasic;
        $scope.optValues = $scope.actionOptions.value;
        $scope.urlParse = $scope.actionOptions.urlComplete;
        let mapping = await $http.get(
          `/action/fields/${$scope.obj.peerAction}`
        );
        let actionMappingFields = mapping.data.data.fields;
        if ($scope.obj.actionMapping == null) {
          $scope.obj.actionMapping = Array();
        }
        actionMappingFields.forEach(a => {
          a.value = "";
          $scope.obj.actionMapping.forEach(z => {
            if (a.key == z.key) {
              a.value = z.value;
            }
          });
        });

        $scope.obj.actionMapping = actionMappingFields;
      }
      let inputCount = $scope.getPopeLength($scope.url);
      if ($scope.getPopeLength($scope.urlParse) == 0) {
        if ($state.params.type == "trigger") {
          $scope.obj.peerTriggerUrl = $scope.urlParse;
        } else if ($state.params.type == "action") {
          $scope.obj.peerActionUrl = $scope.urlParse;
        }
        $scope.continueAllow = true;
      } else {
        $scope.continueAllow = false;
      }
      // if (inputCount == 0) {
      //   throw {
      //     type: "no_option"
      //   };
      // }

      $scope.inputs = getPope($scope.url);
    } catch (err) {
      console.log("Err", err);
      if (err.type == "no_option") {
        console.log("change state, as no opt is required");
        return;
      }
      toastr.error(err.data.error);
    }
  };
  $scope.saveMapping = async function(vals, obj, route) {
    try {
      let id = null;
      if ($state.params.type == "trigger") {
        id = $scope.obj.triggerToken;
      } else if ($state.params.type == "action") {
        id = $scope.obj.actionToken;
      }
      let data = await $http.patch(`/token/map/${id}`, {
        value: vals
      });
      $scope.continue(obj, route);
    } catch (err) {
      console.log("Err", err);
      toastr.error(err.data.error);
    }
  };
  $scope.testTrigger = async function() {
    try {
      let res = await $http.get(`/peer/test/trigger/${$state.params.id}`);
      delete $scope.errorMsg;
      $scope.successMsg = res.data.message;
      $scope.obj.triggerResponse = res.data.data;
      $scope.sampleResponse = JSON.stringify(res.data.data, undefined, 2);
      $scope.continueAllow = true;
    } catch (err) {
      console.log("Err", err);
      delete $scope.successMsg;
      $scope.errorMsg = err.data.error || "Test Unsuccessfull!";
      console.log($scope.errorMsg);
      $scope.continueAllow = false;
      // toastr.error(err.data.error);
    }
  };
  $scope.makeSelectBox = function(tmpId, scope) {
    let jh = new JsonHelper();
    let mappingArr = jh.toArray($scope.obj.triggerResponse);
    let box = `<span class="select2_selecter_custom"><select id="selectBoxID" class="select2_selecter_custom__selectbox"><option></option></select></span>`;
    $("#" + tmpId)
      .parent(".input-group")
      .after(box);
    readySelectBox("#selectBoxID", mappingArr, "New Action Mapping");
    $("#selectBoxID").select2("open");
    $(".select2_selecter_custom__selectbox").on("select2:close", function() {
      setTimeout(() => {
        $(".select2_selecter_custom").remove();
      }, 0);
    });
    $(".select2_selecter_custom__selectbox").on("select2:select", function(e) {
      if (typeof scope.value === "undefined") scope.value = "";
      scope.value = `${scope.value}{{${e.params.data.id}}}`;
      if (!$scope.$$phase) $scope.$apply();
      $("#" + tmpId).focus();
    });
  };
  $scope.testAction = async function() {
    try {
      let res = await $http.get(`/peer/test/${$state.params.id}/editor-test`);
      delete $scope.errorMsg;
      $scope.successMsg = res.data.message;
      $scope.sampleResponse = JSON.stringify(res.data.data[0], undefined, 2);
      $scope.continueAllow = true;
      $scope.obj.complete = true;
    } catch (err) {
      console.log("ERR", err);
      delete $scope.successMsg;
      console.log($scope.errorMsg);
      $scope.continueAllow = false;
      $scope.errorMsg = err.data.error || "Test Unsuccessfull!";
      // toastr.error(err.data.error);
    }
  };
});
