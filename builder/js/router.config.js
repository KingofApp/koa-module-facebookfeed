(function() {
  'use strict';

  angular
    .module('facebookFeed.router.config', ['ngRoute'])
    .config(setDefaultPaths);
  setDefaultPaths.$inject = ['$routeProvider'];

  function setDefaultPaths($routeProvider) {
    //Default Route
    $routeProvider
      .when("/config", {templateUrl: "config.html", controller: "configController"})
      .when("/error", {templateUrl: "error.html"})
      .otherwise({redirectTo: "/error"});
  }
}());
