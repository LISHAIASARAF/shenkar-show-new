'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
    .directive('header', function () {
        return {
            templateUrl: 'scripts/directives/header/header.html',
            restrict: 'E',
            scope:{},
            replace: true,
            controller: function ($scope,$rootScope) {
                $scope.user = $rootScope.user;
            }
        }
    });


