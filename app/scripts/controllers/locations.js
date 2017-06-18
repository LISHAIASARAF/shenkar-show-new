angular.module('sbAdminApp')
    .controller('LocationsCtrl', function ($scope, $position, $http, $cookies, $rootScope, $state) {
        $scope.init = function () {
            $http.get('https://shenkar-show.herokuapp.com/institute/locations').then(function (res) {
                $scope.locations = res.data;
            });
        }
    });