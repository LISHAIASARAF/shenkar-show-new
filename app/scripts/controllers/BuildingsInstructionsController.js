'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('BuildingsInstructionCtrl', function ($scope, $rootScope, $state) {
        $scope.init = function () {
            if (!$rootScope.user) {
                $state.go('login');
            } else {

                $scope.me = $rootScope.user;

                if ($scope.me.role != 'admin') {
                    alert('אין לך הרשאה');
                    $state.go('dashboard.home');
                }
            }


        };
    });