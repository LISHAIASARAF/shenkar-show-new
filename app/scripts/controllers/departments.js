'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('DepartmentsCtrl', function ($scope, $position, $http, $cookies, $rootScope, $state) {
        $scope.departments = [];
        if (!$rootScope.user) {
            $state.go('login');
        }
        $scope.new = {
            institute: $rootScope.user.institute
        }
        ;

        $scope.init = function () {
            getDepartmentsMangers();
        };

        function getDepartmentsMangers() {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.defaults.headers.common['X-Access-Token'] = $cookies.shenkarShowUserId;
            $http.get('https://shenkar-show.herokuapp.com/institute/users').then(function (resp) {
                $scope.users = resp.data;
                $http.get('https://shenkar-show.herokuapp.com/institute/departments').then(function (resp) {


                    $scope.departments = resp.data;

                });
            });
            // $http.get('scripts/users.json').then(function (resp) {
            //     $scope.users = resp.data;
            //     $http.get('scripts/departments.json').then(function (resp) {
            //
            //
            //         $scope.departments = resp.data;
            //
            //     });
            // });

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
            $scope.departments.forEach(function (d) {
                if (d.id == id) {
                    $scope.selected = angular.copy(d);
                }
            });

            if (!$scope.selected) {
                return false;
            }
        }

        $scope.update = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.post('https://shenkar-show.herokuapp.com/institute/updateDepartment', $scope.selected).then(function (resp) {
                toastr.info('המחלקה עודכנה בהצלחה');
                $scope.init();
                $('#edit').modal('hide');

            });
        }
        $scope.create = function () {
            //'https://shenkar-show.herokuapp.com/department/users'

            $http.post('https://shenkar-show.herokuapp.com/institute/createDepartment', $scope.new).then(function (resp) {
                toastr.info('המחלקה עודכנה בהצלחה');
                $scope.init();
                $('#new').modal('hide');

            }, function (err) {

            });
        }
        $scope.delete = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.delete('https://shenkar-show.herokuapp.com/department/' + $scope.selected.id).then(function (resp) {
                toastr.info('נמחק בהצלחה');
                $scope.init();

            });
        }

    });
