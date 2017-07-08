'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('InstitutesCtrl', function ($scope, $position, $http, $cookies, $rootScope, $state) {
        $scope.departments = [];
        $scope.new = {};
        $scope.init = function () {
            if (!$rootScope.user) {
                $state.go('login');
            } else {
                $scope.me = $rootScope.user;

                if ($scope.me.role != 'admin' && $scope.me.role != 'institute manager') {
                    alert('אין לך הרשאה');
                    $state.go('dashboard.home');
                }
            }
            getInstitues();
            getBuildings();
        };

        function getBuildings() {
            $http.get('https://shenkar-show.herokuapp.com/institute/buildings').then(function (resp) {
                $scope.buildings = resp.data;
            });
        };

        $scope. getBuldingName=function(id) {

            var name = '';
            $scope.buildings.forEach(function (b) {
                if (b.id == id) {
                    name = b.name;
                }
            });

            return name;
        }

        function getInstitues() {

            //'https://shenkar-show.herokuapp.com/department/users'
            $http.defaults.headers.common['X-Access-Token'] = $cookies.shenkarShowUserId;


            var url = '';

            if ($scope.me.role == 'admin') {
                url = 'https://shenkar-show.herokuapp.com/admin/institutes';
            }
            else if ($scope.me.role == 'institute manager') {
                url = 'https://shenkar-show.herokuapp.com/institute';
            }


            $http.get(url).then(function (resp) {
                $scope.institutes = resp.data;
            });
        }


        $scope.getManagerName = function (id) {
            var name = '';
            $scope.users.forEach(function (u) {
                if (u._id == id) {
                    name = u.name;
                }
            });

            return name;
        }

        $scope.setEdit = function (id) {
            $scope.selected = null;
            $scope.institutes.forEach(function (d) {
                if (d.id == id) {
                    $scope.selected = angular.copy(d);
                }
            });

            if (!$scope.selected) {
                return false;
            }
        };

        $scope.update = function () {
            var payload = new FormData();
            payload.append("name", $scope.selected.name || '');
            payload.append("aboutText", $scope.selected.aboutText || '');
            payload.append("lineColor", $scope.selected.lineColor || '');
            payload.append("mainTextColor", $scope.selected.mainTextColor || '');
            payload.append("primaryColor", $scope.selected.primaryColor || '');
            payload.append("secondaryColor", $scope.selected.secondaryColor || '');
            payload.append("logoUrl", $scope.selected.logoUrl || '');
            payload.append("aboutImageUrl", $scope.selected.aboutImageUrl || '');
            payload.append("building", $scope.selected.building);

            payload.append("id", $scope.selected.id);

            var url = '';

            if ($scope.me.role == 'admin') {
                url = 'https://shenkar-show.herokuapp.com/admin/updateInstitute';
            }
            else if ($scope.me.role == 'institute manager') {
                url = 'https://shenkar-show.herokuapp.com/institutes/update';
            }

            return $http({
                url: url,
                method: 'POST',
                data: payload,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function (resp) {
                toastr.info(' נתונים נשמרו בהצלחה');
                $scope.init();
                $('.modal').modal('hide');
            });
            // $http.post('https://shenkar-show.herokuapp.com/admin/updateInstitute', $scope.selected).then(function (resp) {
            //     toastr.info('המוסד עודכן בהצלחה');
            //     $scope.init();
            //     $('#edit').modal('hide');
            //
            // });
        };

        $scope.create = function () {
            var payload = new FormData();
            payload.append("name", $scope.new.name);
            payload.append("aboutText", $scope.new.aboutText);
            payload.append("lineColor", $scope.new.lineColor);
            payload.append("mainTextColor", $scope.new.mainTextColor);
            payload.append("primaryColor", $scope.new.primaryColor);
            payload.append("secondaryColor", $scope.new.secondaryColor);
            payload.append("logoUrl", $scope.new.logoUrl);
            payload.append("aboutImageUrl", $scope.new.aboutImageUrl);
            payload.append("building", $scope.new.building.id);

            return $http({
                url: 'https://shenkar-show.herokuapp.com/admin/createInstitute',
                method: 'POST',
                data: payload,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).then(function (resp) {
                toastr.info(' נתונים נשמרו בהצלחה');
                $scope.init();
                $('.modal').modal('hide');
            });

        };

        $scope.delete = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.post('https://shenkar-show.herokuapp.com/admin/deleteInstitute',
                {
                    id: $scope.selected.id
                }
            )
                .then(function (resp) {
                    toastr.info('נמחק בהצלחה');
                    $scope.init();
                    $('.modal').modal('hide');
                });
        };

    });
