angular
  .module('facebookFeed.config.controller', [])
  .controller('configController', configController);

configController.$inject = ['$q','$scope', '$translatePartialLoader', '$translate', '$http'];

function configController($q, $scope, $translatePartialLoader, $translate, $http) {

  $translatePartialLoader.addPart('config');
  $translate.refresh();

  $scope.menuActive = "receiving";
  $scope.showLoader = true;
  $scope.formData = {};

  $scope.errorMsg = 'error';
  $scope.error = false;
  var data = {};

  koappComm.iframe.ready();

  koappComm.iframe.onData(function(msg){
    if(msg._id && msg.lang && msg.accessToken){
      data = msg;
      $translate.use(data.lang);
      $translate.refresh();
      setMessage("data_received", "config").then(function() {
        $scope.showLoader = false;
      });
    }
  });

  $scope.config = function() {
    console.log($scope);

    if($scope.formData.appId && $scope.formData.appSecret){
      obtainToken().then(function(response) {
        console.log(response.data);
        if(response.data.indexOf("access_token=") != -1){
          data.plugin.scope.accesstoken = response.data.replace("access_token=", "");
          nextStep();
        }else {
          errorCallback("error access_token not found");
        }
      }, errorCallback);
    }

    function nextStep() {
      setMessage("service_created","finish")
      .then(finishConfig);
    }
  };

  function obtainToken() {
    var config = {
      'params':{
        'client_id': $scope.formData.appId,
        'client_secret': $scope.formData.appSecret,
        'grant_type': 'client_credentials'
      }
    };
    return $http.get('https://graph.facebook.com/oauth/access_token', config);
  }
  function finishConfig() {
    koappComm.iframe.sendData(data);
    console.log("DATA sendback",data);
    koappComm.iframe.close();
    setMessage("finished","finish");
  }

  function errorCallback(e) {
    $scope.error = true;
    $scope.errorMsg = 'error_id_token';
    console.log(e);
    apply();
  }

  function setMessage(msg,active) {
    var defer = $q.defer();
    $scope.showLoader = false;
    $scope.message = msg;
    setTimeout(function () {
      if(active != 'finish'){
        $scope.showLoader = true;
      }
      $scope.menuActive = active;
      defer.resolve();

    }, 2000);

    apply();
    return defer.promise;
  }

  function apply() {
    if(!$scope.$$phase) {
      $scope.$apply();
    }
  }
};
