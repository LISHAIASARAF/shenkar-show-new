angular.module('sbAdminApp')
    .controller('LocationsCtrl', function ($scope, $position, $http, $cookies, $rootScope, $state) {
        $scope.init = function () {
            $http.get('https://shenkar-show.herokuapp.com/institute/locations').then(function (res) {
                $scope.locations = res.data;
            });
        };

        $scope.setEdit = function (id) {
            $scope.selected = null;

            $scope.locations.forEach(function (l) {
                if (l.id == id) {
                    $scope.selected = angular.copy(l);
                }
            });

        };
    });