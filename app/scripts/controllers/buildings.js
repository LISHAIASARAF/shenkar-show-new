'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('BuildingsCtrl', function ($scope, $position, $http, $rootScope, $state, $cookies) {
            $scope.init = function () {
                if (!$rootScope.user) {
                    $state.go('login');
                } else {
                    $scope.me = $rootScope.user;
                    if ($scope.me.role != 'institute manager') {
                        alert('אין לך הרשאה');
                        $state.go('dashboard.home');
                    }
                    $scope.new = {
                        institute: $rootScope.user.institute
                    };
                }

                $http.defaults.headers.common['X-Access-Token'] = $cookies.shenkarShowUserId;
                getLocations();
                getBuildings();
            };

            function getBuildings() {
                var url = 'https://shenkar-show.herokuapp.com/institute/buildings';

                $http.get(url).then(function (resp) {
                    $scope.buildings = resp.data;
                });
            }

            function getLocations() {
                $http.get('https://shenkar-show.herokuapp.com/institute/locations').then(function (resp) {
                    $scope.locations = resp.data;

                });
            }

            $scope.setEdit = function (id) {
                $scope.selected = null;

                $scope.buildings.forEach(function (d) {
                    if (d.id == id) {
                        $scope.selected = angular.copy(d);
                    }
                });

                if (!$scope.selected) {
                    return false;
                }
            };

            $scope.update = function () {
                var b = angular.copy($scope.selected);
                b.location = b.location.id;
                $http.post('https://shenkar-show.herokuapp.com/institute/updateBuilding', b).then(function () {
                    toastr.info('הנתונים נשמרו בהצלחה');
                    $scope.init();
                    $('.modal').modal('hide');
                });
            };

            $scope.create = function () {
                $http.post('https://shenkar-show.herokuapp.com/institute/createBuilding', $scope.new).then(function () {
                    toastr.info('הנתונים נשמרו בהצלחה');
                    $scope.init();
                    $('.modal').modal('hide');
                });
            };

            $scope.delete = function () {
                //'https://shenkar-show.herokuapp.com/department/users'
                $http.post('https://shenkar-show.herokuapp.com/institute/deleteBuilding', {
                    id: $scope.selected.id,
                    institute: $rootScope.user.institute
                }).then(function (resp) {
                    toastr.info('נמחק בהצלחה');
                    $scope.init();

                });
            }
        }
    );
