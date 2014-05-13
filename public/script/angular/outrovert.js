var router = function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/partials/activityFeed',
    controller: 'activityFeed'
  });
  $routeProvider.when('/marketplace', {
    templateUrl: '/partials/marketplace',
    controller: 'marketplace'
  });
  $routeProvider.when('/mygear', {
    templateUrl: '/partials/myGear',
    controller: 'myGear'
  });
}

var app = angular.module('outrovert', ['firebase', 'ngRoute', 'ui.bootstrap'], router);
//window.developmentMode = true;
