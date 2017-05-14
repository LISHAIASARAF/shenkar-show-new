'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('InstitutesCtrl', function ($scope, $position, $http, $q) {
        $scope.departments = [];
        $scope.new={
            manager:'1'
        }
        $scope.init = function () {
            getDepartmentsMangers();

        }

        function getDepartmentsMangers() {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.get('https://shenkar-show.herokuapp.com/admin/institutes').then(function (resp) {
                $scope.institutes = resp.data;
            });
            // $http.get('https://shenkar-show.herokuapp.com/institute/createUser').then(function (resp) {
            //     $scope.users = resp.data;
            //
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
            $scope.institutes.forEach(function (d) {
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
            $http.put('https://shenkar-show.herokuapp.com/institutes',$scope.selected).then(function (resp) {
                toastr.info('המחלקה עודכנה בהצלחה');
                $scope.init();
                $('#edit').modal('hide');

            });
        }

        $scope.create = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.post('https://shenkar-show.herokuapp.com/institutes',$scope.new).then(function (resp) {
                toastr.info('המחלקה עודכנה בהצלחה');
                $scope.init();
                $('#new').modal('hide');

            },function(err){

            });
        }

        $scope.delete = function () {
            //'https://shenkar-show.herokuapp.com/department/users'
            $http.delete('https://shenkar-show.herokuapp.com/institutes/'+$scope.selected._id).then(function (resp) {
                toastr.info('נמחק בהצלחה');
                $scope.init();

            });
        }

    });
