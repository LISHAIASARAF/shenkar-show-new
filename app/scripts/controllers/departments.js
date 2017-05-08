'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('DepartmentsCtrl', function ($scope, $position, $http, $q) {
        $scope.departments = []
        $scope.new={
            manager:'1'
        }
        $scope.init = function () {
            getDepartmentsMangers();

        }

        function getDepartmentsMangers() {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.get('https://shenkar-show.herokuapp.com/department/users',{ withCredentials: true}).then(function (resp) {
                $scope.users = resp.data;
                $http.get('scripts/departments.json').then(function (resp) {


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
                if (d._id == id) {
                    $scope.selected = angular.copy(d);
                }
            });

            if (!$scope.selected) {
                return false;
            }
        }

        $scope.update = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.put('https://shenkar-show.herokuapp.com/department',$scope.selected).then(function (resp) {
                toastr.info('המחלקה עודכנה בהצלחה');
                $scope.init();
                $('#edit').modal('hide');

            });
        }
        $scope.create = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.post('https://shenkar-show.herokuapp.com/department',$scope.new).then(function (resp) {
                toastr.info('המחלקה עודכנה בהצלחה');
                $scope.init();
                $('#new').modal('hide');

            },function(err){

            });
        }
        $scope.delete = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.delete('https://shenkar-show.herokuapp.com/department/'+$scope.selected._id).then(function (resp) {
                toastr.info('נמחק בהצלחה');
                $scope.init();

            });
        }

    });
