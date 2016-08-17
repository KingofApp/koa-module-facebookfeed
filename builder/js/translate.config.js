(function() {
  'use strict';

  angular
    .module('facebookFeed.translate.config', [])
    .config(setTranslateConfig);
  setTranslateConfig.$inject = ['$translateProvider'];

  function setTranslateConfig($translateProvider) {

    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: 'locale/{part}.{lang}.json'
    });
    $translateProvider.preferredLanguage('en_US');

  }
}());
