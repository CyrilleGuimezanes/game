!'use strict';
var isDebug = false;
var map = [];
var pnjs = [];
var projectiles = [];
var occupableItems = [];

var gold = 0;
var wood = 0;
var stone = 0;

var apply = function(){
  angular.element(document.getElementById('ctrl')).scope().$apply();
}
/**
 * @ngdoc overview
 * @name ltfmkApp
 * @description
 * # ltfmkApp
 *
 * Main module of the application.
 */
var app = angular
  .module('ltfmkApp', [
    'lt-fmk',
    //'angular-iscroll'
  ])
  .config(['fmkProvider', function(fmk){

        fmk.initConfig(function(){


            fmk.log.addCategory("*");
            //fmk.log.addCategory("fmk.init");


            //fmk.sound.register("clic", "sounds/clic.mp3");

            //fmk.asset.preloadSound("bargain");

            fmk.route.set('login',
              {
                templateUrl: 'views/login.html',
                url: "/login",
                controller: 'LoginCtrl',
                //social: true
              }
            );//login
            fmk.route.set('map',
              {
                templateUrl: 'views/map.html',
                url: "/map",
                controller: 'MapController',
                //secured: true
              }
            );//map

            if (!window.isUnitTest)
              fmk.route.setDefault("/map");

            //fmk.service.set('map.params', 'map/params/:token/:userId', fmk.service.methods.GET);

        });
  }])
.run(['$rootScope','fmk', function($rootScope, fmk){
  $rootScope.map = window.map;
  $rootScope.pnjs = window.pnjs;
  $rootScope.projectiles = window.projectiles;
  window.mapManager = new MapManager();
}])
;
