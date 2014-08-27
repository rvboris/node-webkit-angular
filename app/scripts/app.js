'use strict';

angular
    .module('app', [
        'ngAnimate',
        'ngResource',
        'ui.router'
    ])
    .config(function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    });
